<template>
    <div class="content" @dragend="cancelDragDomFunc">
        <div style="background-color: #e6e6e6">
            开启修改
            <img
                style="width: 55px;height: 20px;"
                @click="isEditing = !isEditing"
                :src="isEditing?'https://n4-q.mafengwo.net/s10/M00/18/A2/wKgBZ1jc3R6AYhi_AAB-2Jyz1WU027.png':'https://c2-q.mafengwo.net/s10/M00/18/1D/wKgBZ1jc3A-AKDulAABm0wptOh4037.png'"/>
        </div>
        <div class="app_page">
            <div class="left_tools" v-if="isEditing">
                <div :class="{active:leftToolSelect=='widget'}"
                     @click="leftToolSelect=(leftToolSelect==='widget'?'':'widget')">控件
                </div>
                <div :class="{active:leftToolSelect=='widget22'}"
                     @click="leftToolSelect=(leftToolSelect==='widget22'?'':'widget22')">控件
                </div>
            </div>
            <div class="left_tools_content" v-if="isEditing && leftToolSelect!==''"
                 :style="{width:leftToolInfo[leftToolSelect]?leftToolInfo[leftToolSelect].width+'px':''}">
                <tools_widget v-if="leftToolSelect=='widget'" @drag='dragWidget'></tools_widget>
                <div v-else-if="leftToolSelect=='widget22'">afasdf</div>
            </div>
            <div id="app_content">
                <div>
                    <word v-if="appType==='word'" :dragDomFunc="dragDomFunc"></word>
                    <excel v-else-if="appType==='excel'" :dragDomFunc="dragDomFunc"></excel>
                    <free-panel v-else-if="appType==='freePanel'" :dragDomFunc="dragDomFunc"></free-panel>
                    <ppt v-else-if="appType==='ppt'" :dragDomFunc="dragDomFunc"></ppt>
                    <use-file
                        v-else-if="appType===1 && fileData.file_data"
                        :dragDomFunc="dragDomFunc" :fileData="fileData.file_data"
                        :isEditing="isEditing"
                        class="used-dashboard"
                        @save="save"
                        @eval="eval"
                        @addWidgetContent="addWidgetContent"
                    ></use-file>
                    <component v-else-if="appType==='test'" :is="currentView" style="wifcondth: 100%;"></component>
                </div>
            </div>
            <div
                class="right_tools_content"
                v-show="isEditing && rightToolSelect!==''"
                :style="{width:rightToolInfo[rightToolSelect]?rightToolInfo[rightToolSelect].width+'px':''}"
            >
                <datas-vue
                    v-show="rightToolSelect=='data'"
                    :connections="connections"
                    @change="editVar"
                    :useCreateVar="useCreateVar"
                    @delete="deleteVar"
                ></datas-vue>
                <div
                    v-show="rightToolSelect=='var'">
                    <div style="flex-grow: 1;padding: 3px 3px;overflow: auto">
                        <all-vars
                            @change="editVar"
                            :varToDom="varToDom"
                            :useCreateVar="useCreateVar"
                            @hover="varHover"
                            @delete="deleteVar"
                        ></all-vars>
                    </div>
                </div>
            </div>
            <div class="right_tools" v-show="isEditing">
                <div :class="{active:rightToolSelect=='var'}"
                     @click="rightToolSelect=(rightToolSelect==='var'?'':'var')">已添加对象
                </div>
                <div :class="{active:rightToolSelect=='data'}"
                     @click="rightToolSelect=(rightToolSelect==='data'?'':'data')">数据
                </div>
                <!--<div :class="{active:rightToolSelect=='html'}"-->
                <!--@click="rightToolSelect=(rightToolSelect==='html'?'':'')">HTML-->
                <!--</div>-->
            </div>
        </div>
        <div class="floatVal" v-if="editObjArr.length > 0"
             v-for="item,key in editObjArr" :style="{zIndex:key+100}">
            <div>
                <div>对象：{{item.name}}
                    <div @click="editObjArrPop"
                         style="position: absolute;right: 0px;top: 0;background-color: grey;width: 20px;color: white;text-align: center;">
                        X
                    </div>
                </div>
                <props-com
                    @change="item.change(item)"
                    v-model="editObjArr[key].obj"
                    :dataType="item.dataType"
                    :is-root="true"
                    style="min-height: 250px;"
                ></props-com>
                <div>
                    <textarea @change="changeCode(editObjArr[key],$event.target.value)"
                              :value="item.code"
                              style="height: 50px;width: 100%;box-sizing: border-box;"></textarea>
                </div>
            </div>
        </div>
        <dynamic-vue></dynamic-vue>
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
import '../widget/TEXT';
import '../widget/IF';
import '../widget/INPUT_DATE';
import '../widget/MIN';
import '../widget/MAX';
import '../widget/SUM';
import '../widget/AVERAGE';
import '../widget/NOW';
import '../widget/TODAY';
import '../widget/ISNUMBER';
import '../widget/SIN';
import '../widget/COS';
import '../widget/TAN';
import '../widget/ASIN';
import '../widget/ACOS';
import '../widget/ATAN';
import '../widget/CHOOSE';
import '../widget/AND';
import '../widget/OR';
import '../widget/NOT';
import '../widget/LEFT';
import '../widget/RIGHT';
import '../widget/MID';
import '../widget/LEN';
import '../widget/relationalModelDelete';
import relationalModel from '../widget/relationalModel';

import allVar from '../observer/allVar';
import dashboard from './dashboard';
import allPageVars from './allVars.vue';
import propsCom from './props/props.vue';
import Obj from '../observer/obj';
import getStrByObj from '../languageParser/getStrByObj';
import datasVue from './tools/datas.vue';
import getOptionByObj from './props/getPropsOptionByObj';
import { createCodeText } from './props/createCodeText';

import ajax from '../api/ajax';
import widgetEvent from './widgetChange';

import word from './dashboard/word.vue';
import excel from './dashboard/excel.vue';
import freePanel from './dashboard/freePanel.vue';
import ppt from './dashboard/ppt.vue';
import useFile from './dashboard/useFile.vue';

import uiWindow from './ui/window.vue';

import { mapActions, mapGetters } from 'vuex';

import Vue from 'vue';
import widget from './widget.vue';

import dynamicVueObject from './dynamicVueObject/dynamicVueObject.vue';
Vue.component(widget.name, widget);
export default {
    data() {
        return {
            isEditing: false,
            dashboardTemplate: [
                {
                    id: 1,
                    name: 'useFile',
                    title: '保存测试'
                }
            ],
            currentView: dashboard(),
            leftToolSelect: '',
            leftToolInfo: {
                widget: {
                    width: 200
                },
                widget22: {
                    width: 300
                }
            },
            rightToolSelect: '',
            rightToolInfo: {
                data: {
                    width: 600
                },
                html: {
                    width: 400
                },
                'var': {
                    width: 500
                }
            },
            connections: [],
            html: '',
            varToDom: {},
            // 选择的app类型
            appType: '',
            fileList: [],
            // 保存的文件
            fileData: {},
            useCreateVar: []
        }
    },
    computed: {
        ...mapGetters('main', ['editObjArr', 'dragDomFunc', 'widgetIdToVar']),
        saveHtml() {
            return this.html.replace(/ random-id="r(\d+)"/g, '');
        }
    },
    methods: {
        ...mapActions('main', ['setConnections', 'varHighlightSet', 'editObjArrPush', 'editObjArrPop', 'setDragDomFunc', 'clearWidgetIdToVar', 'setIsEditing']),
        cancelDragDomFunc() {
            this.$nextTick(() => {
                this.setDragDomFunc(null);
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
        addData(varName, widgetId, dom) {
            let dragDomFunc = this.dragDomFunc;
            if(dragDomFunc === null) {
                dragDomFunc = allMatch.find(item => {
                    return item.func;
                }).name;
                dragDomFunc = 'INPUT';
            }
            console.log(1);
            console.log(dragDomFunc);
            let matchItem = allMatch.find(item => {
                return item.func !== undefined && dragDomFunc.match(item.match);
            });
            console.log(matchItem);
            if(matchItem !== undefined) {
                let code = this.getCodeByMatchItem(matchItem);
                // 新加变量
                this.addData_(varName, widgetId, dom, code);
                // 弹出编辑变量的窗口
                this.editVar(varName);
                if(!this.useCreateVar.includes(varName)) {
                    this.useCreateVar.push(varName);
                }
            }
            this.cancelDragDomFunc();
            this.save();
        },
        addData_(varName, widgetId, dom, code) {
            let insertObj = getEvalObj(1, code);
            allVar.setVar(varName, insertObj[0]);
            let newVar = allVar.getVar(varName);
            // 用来设置变量映射dom
            if(dom !== undefined) {
                this.varToDom[varName] = dom;
            }
            // 用来映射widgetId对应存放的变量
            if(widgetId !== undefined) {
                this.widgetIdToVar[widgetId] = varName;
            }
            if(dom !== undefined) {
                this.varToDom[varName].innerHTML = '';
                this.varToDom[varName].appendChild(newVar.value_.dom);
            }
        },
        dataInit(varName, widgetId, dom) {
            let initVar = allVar.getVar(varName);
            if(initVar) {
                this.varToDom[varName] = dom;
                this.varToDom[varName].innerHTML = '';
                this.varToDom[varName].appendChild(initVar.value_.dom);
            } else {
                this.save();
            }
        },
        // 通过变量对象，修改生成的code
        codeUpdate(editObj) {
            let editVarName = editObj.name;
            editObj.code = createCodeText(editObj.obj);
            if(editVarName !== undefined) {
                let updateVar = allVar.getVar(editVarName);
                let widgePanel = this.varToDom[editVarName];
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
            this.save();
        },
        dragWidget(func) {
            this.setDragDomFunc(func);
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
            console.log('========');
            console.log(code);
            console.log(getEvalObj(1, code)[0]);
            let newObj = getOptionByObj(getEvalObj(1, code)[0]);
            console.log(newObj);
            // MIN(1,MIN(2,4),1)
            // 不能直接覆盖obj.obj，因为js是引用赋值
            obj.obj.type = newObj.type;
            obj.obj.props = newObj.props;
            this.codeUpdate(obj);
            if(obj.parent !== undefined) {
                console.log(obj.parent.emitChange);
                obj.parent.emitChange();
            }
            this.save();
        },
        // app内部可以调用 代码识别
        eval(evalContent) {
            console.log(evalContent);
            getEvalObj(1, evalContent);
        },
        editVar(key) {
            let Var = allVar.getVar(key);
            console.log('---------');
            console.log(Var);
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
            this.editObjArrPush(pushEditObj);
        },
        deleteVar(key) {
            console.log('删除了变量', key);
            if(this.useCreateVar.includes(key)) {
                this.useCreateVar.splice(this.useCreateVar.findIndex(index => index === key), 1);
            }
            this.save();
        },
        destroyWidget(widgetId) {
            console.log(widgetId);
            this.save();
        },
        varHover(key, messageType) {
            this.varHighlightSet({key, 'info': messageType});
        },
        addWidgetContent(widgetKey) {
            widgetEvent.emit('addWidgetContent', widgetKey);
        },
        selectFile(file) {
            file.file_data = JSON.parse(file.file_data);
            file.var_data = JSON.parse(file.var_data);
            file.widget_id_to_var = JSON.parse(file.widget_id_to_var);
            // 先创建对象，保证所有对象都存在
            Object.keys(file.var_data).forEach(item => {
                let insertObj = getEvalObj(1, '""');
                allVar.setVar(item, insertObj[0]);
            });
            // 先后重新赋值正确的对象
            Object.keys(file.var_data).forEach(item => {
                let insertObj = getEvalObj(1, file.var_data[item]);
                allVar.setVar(item, insertObj[0]);
                if(!this.useCreateVar.includes(item)) {
                    this.useCreateVar.push(item);
                }
            });

            // console.log('-----file.widget_id_to_var-----');
            for (let i in file.widget_id_to_var) {
                this.widgetIdToVar[i] = file.widget_id_to_var[i];
                // this.widgetIdToVar = widgetIdToVar;
            }

            // let insertObj = getEvalObj(1, code);
            // allVar.setVar(varName, insertObj[0]);
            console.log(file.var_data);
            this.fileData = file;
        },
        save() {
            if(this.isEditing) {
                let allData = allVar.getAllData();
                let saveData = {};
                for (let i in allData) {
                    if(this.useCreateVar.includes(i)) {
                        saveData[i] = getStrByObj(allData[i].value_);
                    }
                }
                console.log(JSON.stringify(saveData));
                ajax({
                    type: 'PUT',
                    url: 'http://www.tablehub.cn/app/file.html',
                    data: {
                        id: this.fileData.id,
                        file_data: JSON.stringify(this.fileData.file_data),
                        widgetIdToVar: JSON.stringify(this.widgetIdToVar),
                        allVar: JSON.stringify(saveData)
                    }
                }).then((data) => {
                    console.log(data);
                });
            }
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
            console.log(data);
            this.connections = data;
            this.setConnections(data);
        });
        /**
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
         */
        ajax({
            type: 'GET',
            url: 'http://www.tablehub.cn/app/file.html',
            data: {
                id: this.$route.params.fileId
            }
        }).then((data) => {
            console.log('----文件信息----');
            console.log(data);
            this.appType = parseInt(this.$route.params.appType);
            this.selectFile(data);
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
        widgetEvent.on('insertByCode', this.addData_);
        widgetEvent.on('init', this.dataInit);
        widgetEvent.on('change', this.addData);
        widgetEvent.on('editVar', this.editVar);
        widgetEvent.on('destroy', this.destroyWidget);
    },
    destroyed() {
//        this.clearWidgetIdToVar();
//        widgetEvent.removeAllListeners();
//
//        allVar.clear();
    },
    watch: {
        isEditing(val) {
            this.setIsEditing(val);
        }
    },
    components: {
        'all-vars': allPageVars,
        'props-com': propsCom,
        'datas-vue': datasVue,
        'header-nav': headerNav,
        'tools_widget': toolsWidget,
        'word': word,
        'excel': excel,
        'free-panel': freePanel,
        'ppt': ppt,
        'useFile': useFile,
        'ui_window': uiWindow,
        'dynamic-vue': dynamicVueObject
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

    .content {
        width: 100%;
        height: 100%;
        min-width: 930px;
        display: flex;
        flex-direction: column;
        .app_page {
            display: flex;
            width: 100%;
            flex-grow: 1;
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
            #app_content {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                overflow: scroll;
                .used-dashboard {
                    position: relative;
                    min-height: 100%;
                }
                > div {
                    flex-grow: 1;
                    position: relative;
                    overflow: auto;
                    background-color: #f9f9f9;
                    height: 100%;
                }
            }
            .right_tools_content {
                width: 200px;
                min-width: 100px;
                background-color: rgb(51, 51, 51);
                color: #d9d9d9;
                flex-shrink: 0;
                overflow: auto;
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
        }
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
            overflow: hidden;
        }
    }
</style>
