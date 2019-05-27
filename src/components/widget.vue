<template>
    <div class="widget">
        <div class="head_tool" v-if="isEditing">
            <template v-if="data_!==undefined && data_!==''">
                <app-button size="mini" @click="editVar">编辑</app-button>
                <app-button size="mini" @click="chooseExistItem('')">清空</app-button>
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
            :class="{warning:getHighlightState(data_)==='info'}"
            ref="content"
            @dragover="allowDrop($event)"
            @drop.stop="ondrop($event)"
            @click="clickAdd"
        >
            <tempVueClass v-if="vueShow" :initProps="vueShow.dom"></tempVueClass>
        </div>
    </div>
</template>
<script>
import widgetEvent from './widgetChange';
// import widgetIdToVar from './widgetIdToVar';
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
            data_: this.data,
            key: this.$vnode.key,
            isChooseExist: false,
            allVars: [],
            vueShow: null
        };
    },
    mounted() {
        if(this.data !== undefined) {
            widgetEvent.emit('init', this.data, this.key, this.$refs.content, this);
            this.$emit('init', this.data, this.key, this.$refs.content);
        } else {
            this.data_ = this.widgetIdToVar[this.key];
            widgetEvent.emit('init', this.data_, this.key, this.$refs.content, this);
            this.$emit('init', this.data_, this.key, this.$refs.content);
        }
        widgetEvent.on('addWidgetContent', (key) => {
            if(this.key === key) {
                this.ondrop();
            }
        });
    },
    methods: {
        ...mapActions('main', ['setDragDomFunc', 'deleteWidgetIdToVar']),
        getHighlightState(type) {
            if(this.varHighlight.key === type) {
                return this.varHighlight.info;
            }
            return 'none';
        },
        allowDrop(e) {
            e.preventDefault();
        },
        addFunction(dragDomFunc) {
            if(this.isEditing) {
                prompt('请输入名称', 'a7').then((varName) => {
                    if(varName !== null && varName !== '') {
                        this.setDragDomFunc(dragDomFunc);
                        varName = '$' + varName.replace(/^\$/, '');
                        this.data_ = varName;
                        widgetEvent.emit('change', varName, this.item.id, this.$refs.content, this);
                        this.$emit('change', varName, this.item.id, this.$refs.content);
                    }
                });
            }
        },
        ondrop(e) {
            // 如果没有设置key，则不允许拖拽widget，用来定义不可修改组件。反过来说，所有添加了key的widget可以拖拽组件
            if(this.item.id !== undefined) {
                // 抬起鼠标dragDomFunc就会释放为null，这里弹窗将值保留住
                this.addFunction(this.dragDomFunc);
            }
        },
        clickAdd() {
            if(this.data_ === undefined) {
                this.addFunction('TEXT');
            }
        },
        editVar() {
            widgetEvent.emit('editVar', this.data_);
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
                            return item.match.test(val.value_.name);
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
            this.data_ = key;
            this.vueShow = null;
            widgetEvent.emit('bindVar', key, this.item.id, this.$refs.content, this);
            this.$emit('bindVar', key, this.item.id, this.$refs.content, this);
        },
        deleteWidget() {
            widgetEvent.emit('destroy', this.item.id);
        },
        setInnerVueObj(funcObj) {
            this.vueShow = funcObj;
            this.$nextTick(() => {
                this.vueShow.reRender();
            });
        }
    },
    destroyed() {
        if (this.item) {
            this.deleteWidgetIdToVar(this.item.id);
        }
    },
    computed: {
        ...mapGetters('main', ['varHighlight', 'dragDomFunc', 'widgetIdToVar', 'isEditing'])
    },
    components: {
        appButton, dropList, tempVueClass
    },
    watch: {
        // 需要保存的样式
        'item.style'(val) {
            if (this.vueShow) {
                this.vueShow.reRender();
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
            background-color: rgba(193, 42, 12, 0.71);
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
            padding-left: 2px;
            width: 100%;
            min-width: 220px;
            height: 30px;
            top: -33px;
            left: -1px;
            background-color: rgb(228, 228, 228);
            border: solid 1px #a6a6a6;
            display: none;
            > * {
                margin-left: 2px;
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