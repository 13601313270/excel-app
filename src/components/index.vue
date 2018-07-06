<template>
    <div style="width: 100%;height: 100%;min-width: 930px;display: flex;flex-direction: column;"
         @dragend="cancelDragDomFunc">
        <header-nav style="background-color: #3c3f41;border-bottom: solid 1px #4f4f4f;"></header-nav>
        <div style="display: flex;width: 100%;flex-grow: 1;">
            <div class="left_tools">
                <div :class="{active:leftToolSelect=='widget'}" @click="leftToolSelect='widget'">控件</div>
                <div :class="{active:leftToolSelect=='widget22'}" @click="leftToolSelect='widget22'">控件</div>
            </div>
            <div class="left_tools_content" :style="{width:leftToolInfo[leftToolSelect].width+'px'}">
                <tools_widget v-if="leftToolSelect=='widget'" @drag='drag'></tools_widget>
                <div v-else-if="leftToolSelect=='widget22'">afasdf</div>
            </div>
            <div id="content">
                <div style="flex-grow: 1;overflow:auto;background-color: #f9f9f9;height:100%;">
                    <div v-if="documentType===''">
                        <div @click="documentType='word'">文稿</div>
                        <div @click="documentType='excel'">表格</div>
                        <div @click="documentType='freePanel'">黑板</div>
                        <div @click="documentType='ppt'">演示文稿</div>
                    </div>
                    <word v-else-if="documentType==='word'" :dragDomFunc="dragDomFunc"></word>
                    <excel v-else-if="documentType==='excel'" :tableObj="tableObj" :dragDomFunc="dragDomFunc"></excel>
                    <free-panel v-else-if="documentType==='freePanel'" :dragDomFunc="dragDomFunc"></free-panel>
                    <ppt v-else-if="documentType==='ppt'" :dragDomFunc="dragDomFunc"></ppt>
                    <!--<component :is="currentView" style="width: 100%;"></component>-->
                </div>
            </div>
            <div class="right_tools_content" :style="{width:rightToolInfo[rightToolSelect].width+'px'}">
                <datas-vue v-if="rightToolSelect=='data'" :connections="connections" @change="editVar"></datas-vue>
                <div v-else-if="rightToolSelect=='html'">
                    <div style="overflow: auto;border: solid 1px black;">
                        <textarea :value="saveHtml"
                                  style="flex-grow: 1;width: 400px;height:200px;border: none"></textarea>
                    </div>
                </div>
                <div v-show="rightToolSelect=='var'">
                    <div style="flex-grow: 1;padding: 3px 3px;overflow: auto">
                        <all-vars @change="editVar" @hover="hover"></all-vars>
                    </div>
                </div>
            </div>
            <div class="right_tools">
                <div :class="{active:rightToolSelect=='var'}" @click="rightToolSelect='var'">已添加对象</div>
                <div :class="{active:rightToolSelect=='data'}" @click="rightToolSelect='data'">数据</div>
                <div :class="{active:rightToolSelect=='html'}" @click="rightToolSelect='html'">HTML</div>
            </div>
        </div>
        <div class="floatVal" v-if="$store.state.editObjArr.length > 0"
             v-for="item,key in $store.state.editObjArr" :style="{zIndex:key+100}">
            <div>
                <div>对象：{{item.name}}
                    <div @click="$store.commit('editObjArrPop')"
                         style="position: absolute;right: 0px;top: 0;background-color: grey;width: 20px;color: white;text-align: center;">
                        X
                    </div>
                </div>
                <relational-model-props
                    v-if="editDataType==='relationalModel'"
                    @change="item.change"
                    v-model="$store.state.editObjArr[key].obj"
                    :dataType="item.dataType"
                    :is-root="true"
                    style="min-height: 250px;"
                ></relational-model-props>
                <props-com
                    v-else
                    @change="item.change(item)"
                    v-model="$store.state.editObjArr[key].obj"
                    :dataType="item.dataType"
                    :is-root="true"
                    style="min-height: 250px;"
                ></props-com>
                <div>
                    <textarea @change="changeCode($store.state.editObjArr[key],$event.target.value)"
                              :value="item.code"
                              style="height: 50px;width: 100%;box-sizing: border-box;"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import headerNav from './head.vue';
import toolsWidget from './tools/widget.vue';
import getEvalObj from '../languageParser/evalObjAndStr';
import allMatch from '../languageParser/allMatch';
import '../languageParser/array';
import '../languageParser/dictionary';
import '../languageParser/dictionaryGet';
import '../widget/CHECK_BOX';
import '../widget/BAR';
import '../widget/INPUT';
import '../widget/IF';
import '../widget/INPUT_DATE';
import '../widget/MIN';
import '../widget/TEXT';
import relationalModel from '../widget/relationalModel';

import allVar from '../observer/allVar';
import dashboard from './dashboard';
import allPageVars from './allVars.vue';
import propsCom from './props/props.vue';
import relationalModelProps from './props/relationalModelProps.vue';
import Obj from '../observer/obj';
import getStrByObj from '../languageParser/getStrByObj';
import datasVue from './tools/datas.vue';
import getOptionByObj from './props/getPropsOptionByObj';
import createCodeText from './props/createCodeText';

import ajax from '../api/ajax';
import widgetEvent from './widgetChange';

import word from './dashboard/word.vue';
import excel from './dashboard/excel.vue';
import freePanel from './dashboard/freePanel.vue';
import ppt from './dashboard/ppt.vue';
export default {
    data() {
        return {
            documentType: '',
            currentView: dashboard(),
            dragDomFunc: null,
            leftToolSelect: 'widget',
            leftToolInfo: {
                widget: {
                    width: 200
                },
                widget22: {
                    width: 300
                }
            },
            rightToolSelect: 'var',
            rightToolInfo: {
                data: {
                    width: 200
                },
                html: {
                    width: 400
                },
                'var': {
                    width: 300
                }
            },
            editObjArr: [],
            editDataType: '',
            connections: [],
            html: '',
            varToDom: new Map(),
            tableObj: {
                lie: [1, 2, 3, 4],
                hang: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                alltableObj: [],
                tdList: [[1, 2]]
            }
        }
    },
    computed: {
        saveHtml() {
            return this.html.replace(/ random-id="r(\d+)"/g, '');
        }
    },
    methods: {
        cancelDragDomFunc() {
            this.$nextTick(() => {
                this.dragDomFunc = null;
            });
        },
        getCodeByMatchItem(item) {
            let code = item.name + '(';
            let propsArr = [];
            item.props.forEach((item) => {
                let item2 = item;
                let dataType = item2.dataType;
                // let isArr = false;
                if(dataType instanceof Array) {
                    // isArr = true;
                    dataType = dataType[0];
                }
                let pushProp = '';
                if(item2.enum) {
                    for (let j in item2.enum) {
                        pushProp = '"' + j + '"';
                        break;
                    }
                } else if(typeof dataType === 'function') {
                    pushProp = dataType;
                } else if(dataType.split(',').includes('number')) {
                    pushProp = 1;
                } else if(dataType.split(',').includes('string')) {
                    pushProp = '""';
                } else if(dataType.split(',').includes('bool')) {
                    pushProp = 'TRUE';
                } else if(dataType.match(/array\((.*)\)/)) {
                    pushProp = '[]';
                } else {
                    pushProp = '""';
                }
                propsArr.push(pushProp);
                // if (isArr) {
                //     dataType = [dataType];
                // }
            });
            let temp2 = [];
            for (let j = 0; j < propsArr.length; j++) {
                if(typeof propsArr[j] === 'function') {
                    temp2.push(null);
                } else {
                    temp2.push(getEvalObj(1, propsArr[j])[0]);
                }
            }
            for (let j = 0; j < propsArr.length; j++) {
                if(typeof propsArr[j] === 'function') {
                    propsArr[j] = propsArr[j](temp2);
                    console.log(propsArr[j]);
                    if(propsArr[j].split(',').includes('number')) {
                        propsArr[j] = 1;
                    } else if(propsArr[j].split(',').includes('string')) {
                        propsArr[j] = '""';
                    } else if(propsArr[j].split(',').includes('bool')) {
                        propsArr[j] = 'TRUE';
                    } else if(propsArr[j].split(',').includes('array')) {
                        propsArr[j] = '[]';
                    }
                }
            }
            code += propsArr.join(',');
            code += ')';
            return code;
        },
        addData(varName, id, dom) {
            let dragDomFunc = this.dragDomFunc;
            if(dragDomFunc === null) {
                dragDomFunc = allMatch.find(item => {
                    return item.func;
                }).name;
                dragDomFunc = 'INPUT';
            }
            for (let i = 0; i < allMatch.length; i++) {
                let item = allMatch[i];
                if(item.func !== undefined && dragDomFunc.match(item.match)) {
                    let code = this.getCodeByMatchItem(item);
                    let insertObj = getEvalObj(1, code);
                    allVar.setVar(varName, insertObj[0]);
                    this.$store.commit('editObjArrPush', {
                        name: varName,
                        code: getStrByObj(insertObj[0]),
                        change: this.codeUpdate,
                        obj: getOptionByObj(insertObj[0]),
                        dataType: ''
                    });
                    this.editDataType = '';

                    console.log(varName, id, dom);
                    let newVar = allVar.getVar(varName);
                    this.varToDom.set(newVar, dom);
                    let reg = new RegExp('<widget random-id="' + id + '"[^>]*>', 'g');
                    this.html = this.html.replace(reg, '<widget random-id="' + id + '" data="' + varName + '">');
                    this.varToDom.get(newVar).innerHTML = '';
                    this.varToDom.get(newVar).appendChild(newVar.value_.dom);
                }
            }
        },
        dataInit(varName, id, dom) {
            let initVar = allVar.getVar(varName);
            if(initVar) {
                this.varToDom.set(initVar, dom);
                this.varToDom.get(initVar).innerHTML = '';
                this.varToDom.get(initVar).appendChild(initVar.value_.dom);
            }
        },
        // 通过变量对象，修改生成的code
        codeUpdate(editObj) {
            let editVarName = editObj.name;
            editObj.code = createCodeText(editObj.obj);
            if(editVarName !== undefined) {
                let updateVar = allVar.getVar(editVarName);
                let widgePanel = this.varToDom.get(updateVar);
                if(widgePanel !== undefined) {
                    widgePanel.innerHTML = '';
                }
                // allVar.getVar(editVarName).value_.dom.remove();
                let insertObj = getEvalObj(1, editObj.code);
                allVar.setVar(editVarName, insertObj[0]);
                let value_ = updateVar.value_;
                if(widgePanel !== undefined) {
                    if(value_ instanceof Obj) {
                        if(value_.dom) {
                            widgePanel.appendChild(value_.dom);
                        } else {
                            widgePanel.innerHTML = value_.value.toString();// 变量值可以直接赋予数字，字符串 布尔值
                        }
                    } else {
                        widgePanel.innerHTML = value_.toString();// 变量值可以直接赋予数字，字符串 布尔值
                    }
                }
            }
        },
        drag(func) {
            this.dragDomFunc = func;
        },
        allowDrop(e) {
            e.preventDefault();
        },
        ondrop(e) {
            Array.from(e.dataTransfer.files).forEach((item) => {
                let reader = new FileReader();
                reader.readAsText(item);
                reader.onload = function() {
                    let newDash = dashboard();
                    newDash.template = reader.result.match(/<body>([\S|\s]+)<\/body>/)[1];
                    this.currentView = newDash;
                }
            });
        },
        changeCode(obj, code) {
            let newObj = getOptionByObj(getEvalObj(1, code)[0]);
            console.log(newObj);
            // MIN(1,MIN(2,4),1)
            // 不能直接覆盖obj.obj，因为js是引用赋值
            obj.obj.type = newObj.type;
            obj.obj.props = newObj.props;
            console.log(1);
            this.codeUpdate(obj);
            if(obj.parent !== undefined) {
                console.log(obj.parent.emitChange);
                obj.parent.emitChange();
            }
        },
        editVar(key) {
            let Var = allVar.getVar(key);
            let self = this;
            let pushEditObj = {
                name: key,
                code: getStrByObj(Var.value_),
                change: function() {
                    self.codeUpdate(pushEditObj);
                },
                obj: getOptionByObj(Var.value_),
                dataType: ((Var.value_ instanceof relationalModel) ? 'relationalModel' : '')
            };
            this.$store.commit('editObjArrPush', pushEditObj);
            this.$store.watch((store) => {
                console.log(store);
            });
            if(Var.value_ instanceof relationalModel) {
                this.editDataType = 'relationalModel';
            } else {
                this.editDataType = '';
            }
        },
        hover(key, messageType) {
            this.$store.commit('varHighlightSet', {key, 'info': messageType});
        }
    },
    mounted() {
        ajax({
            type: 'POST',
            url: 'http://www.tablehub.cn/action/mysql.html',
            data: {
                type: 'getConnections'
            }
        }).then((data) => {
            this.connections = data;
            this.$store.commit('setConnections', data);
        });
        ajax({
            type: 'POST',
            url: 'http://www.tablehub.cn/action/mysql.html',
            data: {
                type: 'showCreateTable',
                connection: 1,
                table: 'excel'
            }
        }).then((data) => {
            console.log(data);
        });

        // let fileContent = `$a1 = INPUT('number',9999)`;
        // let fileContent = `$a1 = CHECK_BOX(TRUE)`;
        // $a2 = RELATIONAL_MODEL(1,'excel','DATE_FORMAT(ctime,"%Y-%m")',['count(id)','count(id)+4'])
        //
        // id email
        // $a3 = BAR(RELATIONAL_MODEL(1,'user','email',['count(id)','count(id)+1']))
        let fileContent = `$a1 = INPUT('string',"10")
        $a3 = BAR(RELATIONAL_MODEL(1,'excel','DATE_FORMAT(ctime,"%Y-%m")',['count(id)','count(id)+4']))
        $a4 = $a3.select
        $a5 = MIN($a1,1)
        `;
        fileContent = '';
        // let fileContent = `$a1 = BAR(1,'user','state',['count(33)','count(email)'])`;
        // fileContent = '';
        this.html = `<div>
    <div>
        <div><h4>时间</h4><widget data="$a1"></widget>
        <widget data="$a3"></widget></div>
        <div><h4>人民币</h4><widget data="$a4"></widget></div>
        <div><h4>汇率</h4><widget></widget></div>
        <div><h4>美元</h4><widget></widget></div>
        <div><widget></widget></div>
        <div><widget></widget></div>
    </div>
</div>`;

        getEvalObj(1, fileContent);
        console.log(allVar);
        let newDash = dashboard();
        this.html = this.html.replace(/<widget([ |>])/g, function(a, b) {
            return '<widget random-id="r' + parseInt(Math.random() * 1000000) + '"' + b;
        });
        newDash.template = this.html;
        this.currentView = newDash;

        console.log(widgetEvent);
        widgetEvent.on('change', this.addData);
        widgetEvent.on('init', this.dataInit);
    },
    components: {
        'all-vars': allPageVars,
        'props-com': propsCom,
        'datas-vue': datasVue,
        'relational-model-props': relationalModelProps,
        'header-nav': headerNav,
        'tools_widget': toolsWidget,
        'word': word,
        'excel': excel,
        'free-panel': freePanel,
        'ppt': ppt
    }
}
</script>
<style scoped lang="less">
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .left_tools {
        width: 24px;
        flex-shrink: 0;
        flex-grow: 0;
        background-color: #3c3f41;
        color: #d9d9d9;
        border-right: solid 1px #4f4f4f;
        > * {
            word-wrap: break-word;
            margin: 0 1px 2px 0;
            padding: 14px 2px;
            border-radius: 5px 0 0 5px;
            text-align: center;
            cursor: default;
            line-height: 18px;
            color: #b1b1b1;
            &.active {
                background: #333333;
                margin-right: -1px;
                color: white;
            }
            &:hover {
                box-shadow: inset 2px 0 5px 0 #717171;
            }
        }
    }

    .left_tools_content {
        width: 200px;
        min-width: 100px;
        overflow: auto;
        border-right: solid 1px black;
        text-align: center;
        background-color: #333;
        color: #999;
        flex-shrink: 0;
    }

    .right_tools_content {
        width: 200px;
        min-width: 100px;
        background-color: rgb(51, 51, 51);
        color: #d9d9d9;
        flex-shrink: 0;
    }

    #content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .floatVal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(103, 103, 103, 0.59);
        > div {
            background-color: white;
            border-radius: 5px;
            padding: 5px;
            position: relative;
        }
    }

    .right_tools {
        width: 24px;
        flex-shrink: 0;
        flex-grow: 0;
        background-color: #3c3f41;
        color: #d9d9d9;
        border-left: solid 1px #4f4f4f;
        > * {
            word-wrap: break-word;
            margin: 0 1px 2px 0;
            padding: 14px 2px;
            border-radius: 0 5px 5px 0;
            text-align: center;
            cursor: default;
            line-height: 18px;
            color: #b1b1b1;
            &.active {
                background: #333333;
                margin-left: -1px;
                color: white;
            }
            &:hover {
                box-shadow: inset -2px 0px 5px 0px #717171;
            }
        }
    }
</style>
