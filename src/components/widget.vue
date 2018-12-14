<template>
    <div class="widget">
        <div class="head_tool" v-if="isEditing">
            <template v-if="data_!==undefined">
                <app-button size="mini" @click="editVar">编辑</app-button>
                <app-button size="mini" @click="chooseExistItem('')">清空</app-button>
            </template>
            <template v-else>
                <app-button size="mini" @click="clickAdd">新增</app-button>
                <app-button size="mini" @click="chooseExist">绑定现有的</app-button>
                <drop-list v-if="isChooseExist" style="position: absolute;top:30px;left: 55px;">
                    <div v-for="item in allVars" v-html="item" @click="chooseExistItem(item)"></div>
                </drop-list>
            </template>
            <app-button size="mini" @click="deleteWidget">删除</app-button>
        </div>
        <div
            class="widget_content"
            :class="{warning:getHighlightState(data_)=='info'}"
            ref="content"
            @dragover="allowDrop($event)"
            @drop.stop="ondrop($event)"
            @click="clickAdd"
        >
            <div v-if="vueShow">
                <tempVueClass :initProps="vueShow.dom"></tempVueClass>
            </div>
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
        initProps: Array
    },
    render(createElement) {
        return createElement(this.initProps[0], {
            props: this.initProps[1],
            on: this.initProps[2]
        })
    }
}
export default {
    name: 'widget',
    props: ['data'],
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
            // return this.$store.state.varHighlight.key;
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
                    if(varName !== null) {
                        this.setDragDomFunc(dragDomFunc);
                        varName = '$' + varName.replace(/^\$/, '');
                        this.data_ = varName;
                        widgetEvent.emit('change', varName, this.key, this.$refs.content, this);
                        this.$emit('change', varName, this.key, this.$refs.content);
                    }
                });
            }
        },
        ondrop(e) {
            // 如果没有设置key，则不允许拖拽widget，用来定义不可修改组件。反过来说，所有添加了key的widget可以拖拽组件
            if(this.key !== undefined) {
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
                let aaa = allVar.getAllData();
                for (let key in aaa) {
                    let val = aaa[key];
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
            widgetEvent.emit('bindVar', key, this.key, this.$refs.content, this);
            this.$emit('bindVar', key, this.key, this.$refs.content, this);
        },
        deleteWidget() {
            this.$emit('delete');
        },
        setInnerVueObj(funcObj) {
            console.log('=========');
            console.log(funcObj);
            this.vueShow = funcObj;
        }
    },
    destroyed() {
        this.deleteWidgetIdToVar(this.key);
        widgetEvent.emit('destroy', this.key);
    },
    computed: {
        ...mapGetters('main', ['varHighlight', 'dragDomFunc', 'widgetIdToVar', 'isEditing'])
    },
    components: {
        appButton, dropList, tempVueClass
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
            min-width: 20px;
            min-height: 20px;
            /*display: inline-block;*/
        }
        .head_tool {
            position: absolute;
            padding-top: 1px;
            padding-left: 2px;
            width: 100%;
            min-width: 220px;
            height: 30px;
            top: -30px;
            left: -1px;
            background-color: rgb(228, 228, 228);
            border: solid 1px #a6a6a6;
            display: none;
            > * {
                margin-left: 2px;
            }
        }
        &:hover {
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