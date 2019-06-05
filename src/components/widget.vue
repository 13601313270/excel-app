<template>
    <div class="widget">
        <div class="head_tool" v-if="isEditing">
            <template v-if="bindVar!==null">
                <app-button size="mini" @click="editVar">编辑</app-button>
                <app-button size="mini" @click="clearVar(null)">清空</app-button>
            </template>
            <template v-else>
                <app-button size="mini" @click="clickAdd">新增</app-button>
                <app-button size="mini" @click="chooseExist">绑定现有的</app-button>
                <drop-list class="select_val" v-if="isChooseExist">
                    <div v-for="item in allVars" v-html="item" @click="chooseExistItem(item)"></div>
                </drop-list>
            </template>
            <app-button size="mini" @click="deleteWidget">删除</app-button>
        </div>
        <div
            class="widget_content"
            :class="{warning:getHighlightState==='info'}"
            ref="content"
            @dragover="allowDrop($event)"
            @drop.stop="ondrop($event)"
            @click="clickAdd"
        >
            <template v-if="bindVar">
                <tempVueClass v-if="bindVar.value_.dom" :initProps="bindVar.value_.dom"></tempVueClass>
                <div v-else v-html="bindVar.value_"></div>
            </template>
        </div>
    </div>
</template>
<script>
import widgetEvent from './widgetChange';
import appButton from './ui/button.vue';
import dropList from './ui/dropList.vue';
import { mapGetters, mapActions } from 'vuex';
import { prompt } from './alert/prompt';
import allVar from '../observer/allVar';
import allMatch from '../languageParser/allMatch';

let tempVueClass = {
    props: {
        initProps: [Array, HTMLDivElement]
    },
    render(createElement) {
        if(this.initProps instanceof HTMLDivElement) {
            let innerDom = this.initProps;
            return createElement({
                mounted() {
                    this.$refs.inner.innerHTML = '';
                    this.$refs.inner.appendChild(innerDom);
                },
                template: `<div ref="inner" style="height:100%">111</div>`
            });
        } else {
            return createElement(this.initProps[0], {
                props: this.initProps[1],
                on: this.initProps[2]
            })
        }
    }
};

export default {
    name: 'widget',
    props: ['data', 'item'],
    data() {
        return {
            varName: this.data,
            key: this.$vnode.key,
            isChooseExist: false,
            allVars: [],
            bindVar: null
        };
    },
    mounted() {
        let varName = this.data || this.widgetIdToVar[this.key];
        widgetEvent.emit('init', varName, this);

        let initVar = allVar.getVar(varName);
        if (initVar) {
            this.setBindVar(initVar);
        }
        // this.$emit('init', varName, this); // 暴露给开发者的，系统没有用到
        widgetEvent.on('addWidgetContent', (key) => {
            if (this.key === key) {
                this.ondrop();
            }
        });
    },
    methods: {
        ...mapActions('main', ['setDragDomFunc', 'deleteWidgetIdToVar']),
        allowDrop(e) {
            e.preventDefault();
        },
        setFunction(dragDomFunc) {
            if(this.isEditing) {
                prompt('请输入名称', dragDomFunc + '7').then((varName) => {
                    if(varName !== null && varName !== '') {
                        this.setDragDomFunc(dragDomFunc);
                        varName = '$' + varName.replace(/^\$/, '');
                        // 创建变量
                        widgetEvent.emit('change', varName, dragDomFunc);
                        // 绑定变量到本widget
                        widgetEvent.emit('bindVar', varName, this.item.id, this);
                        // this.$emit('change', varName, this.item.id, this.$refs.content);
                    }
                });
            }
        },
        ondrop(e) {
            // 如果没有设置key，则不允许拖拽widget，用来定义不可修改组件。反过来说，所有添加了key的widget可以拖拽组件
            if(this.item.id !== undefined) {
                // 抬起鼠标dragDomFunc就会释放为null，这里弹窗将值保留住
                this.setFunction(this.dragDomFunc);
            }
        },
        clickAdd() {
            if(this.bindVar === null) {
                this.setFunction('TEXT');
            }
        },
        editVar() {
            widgetEvent.emit('editVar', this.bindVar.name); // 被修改的变量名称
        },
        chooseExist() {
            this.isChooseExist = !this.isChooseExist;
            if(this.isChooseExist) {
                let keys = [];
                let allData_ = allVar.getAllData();
                for (let key in allData_) {
                    let val = allData_[key];
                    if(val.value_ !== undefined) {
                        let matchItem = allMatch.find(item => {
                            return item.match.test(val.value_.name) || item.match.test(val.value_);
                        });
                        if(matchItem) {
                            if(matchItem.returnType !== 'relationalModel') {
                                keys.push(key);
                            }
                        }
                    }
                }
                this.allVars = keys;
            }
        },
        chooseExistItem(key) {
            this.bindVar = null;
            widgetEvent.emit('bindVar', key, this.item.id, this);
            this.$emit('bindVar', key, this.item.id, this.$refs.content, this);
        },
        clearVar(key) {
            this.bindVar = null;
            widgetEvent.emit('clearVar', key, this.item.id);
            this.$emit('clearVar', key, this.item.id);
        },
        deleteWidget() {
            widgetEvent.emit('destroy', this.item.id);
        },
        // 绑定变量
        setBindVar(VarObj) {
            this.bindVar = VarObj;
            this.$nextTick(() => {
                // 有一些变量绑定的是数字，字符串等基础类型，没有reRender
                if (this.bindVar.value_.reRender) {
                    this.bindVar.value_.reRender();
                }
            });
        }
    },
    destroyed() {
        if (this.item) {
            this.deleteWidgetIdToVar(this.item.id);
        }
    },
    computed: {
        ...mapGetters('main', ['varHighlight', 'dragDomFunc', 'widgetIdToVar', 'isEditing']),
        getHighlightState() {
            if (this.bindVar && this.varHighlight.key === this.bindVar.name) {
                return this.varHighlight.info;
            }
            return 'none';
        }
    },
    components: {
        appButton, dropList, tempVueClass
    },
    watch: {
        // 需要保存的样式
        'item.style'(val) {
            if (this.bindVar.value_ && this.bindVar.value_.reRender) {
                // 有一些变量绑定的是数字，字符串等基础类型，没有reRender
                this.bindVar.value_.reRender();
            }
            widgetEvent.emit('setStyle', this.item.id, val);
        }
    }
}
</script>
<style scoped lang="less">
    .widget {
        position: relative;
        .warning {
            background-color: rgb(241, 124, 101);
            box-shadow: inset 0 0 3px 1px #ffffff;
        }

        .widget_content {
            width: 100%;
            height: 100%;
            min-width: 40px;
            min-height: 40px;
            /*display: inline-block;*/
        }
        .head_tool {
            position: absolute;
            padding-top: 1px;
            width: 100%;
            min-width: 220px;
            height: 30px;
            top: -33px;
            left: -1px;
            background-color: rgb(228, 228, 228);
            border: solid 1px #a6a6a6;
            display: none;
            z-index: 1;

            > * {
                margin-left: 2px;

                &:first-child {
                    margin-left: 4px;
                }
            }
        }
        .select_val {
            position: absolute;
            z-index: 1;
            top: 30px;
            left: 55px;
        }
        &:hover {
            overflow: visible!important;
            .head_tool {
                display: block;
            }
        }
    }
</style>
<style>
    .warning input {
        background-color: rgba(255, 255, 255, 0.21);
    }
</style>