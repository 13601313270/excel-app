<template>
    <div style="width: 100%;height: 100%;min-width: 930px;display: flex;flex-direction: column;"
         @dragend="cancelDragDomFunc">
        <header-nav style="background-color: #3c3f41;border-bottom: solid 1px #4f4f4f;"></header-nav>
        <div style="display: flex;width: 100%;flex-grow: 1;">
            <div class="left_tools">
                <div :class="{active:leftToolSelect=='widget'}"
                     @click="leftToolSelect=(leftToolSelect==='widget'?'':'widget')">控件
                </div>
                <div :class="{active:leftToolSelect=='widget22'}"
                     @click="leftToolSelect=(leftToolSelect==='widget22'?'':'widget22')">控件
                </div>
            </div>
            <div class="left_tools_content" v-if="leftToolSelect!==''"
                 :style="{width:leftToolInfo[leftToolSelect]?leftToolInfo[leftToolSelect].width+'px':''}">
                <tools_widget v-if="leftToolSelect=='widget'" @drag='drag'></tools_widget>
                <div v-else-if="leftToolSelect=='widget22'">afasdf</div>
            </div>
            <div id="content">
                <div>
                    <div v-if="appType===''">
                        <div @click="chooseApp('word')">文稿</div>
                        <div @click="chooseApp('excel')">表格</div>
                        <div @click="chooseApp('freePanel')">黑板</div>
                        <div @click="chooseApp('ppt')">演示文稿</div>
                        <div @click="chooseApp('test')">测试</div>
                        <div v-for="item in dashboardTemplate" @click="chooseApp(item.id)" v-html="item.title"></div>
                    </div>
                    <template v-if="appType!=='' && !isChooseFile">
                        <word v-if="appType==='word'" :dragDomFunc="dragDomFunc"></word>
                        <excel v-else-if="appType==='excel'" :dragDomFunc="dragDomFunc"></excel>
                        <free-panel v-else-if="appType==='freePanel'" :dragDomFunc="dragDomFunc"></free-panel>
                        <ppt v-else-if="appType==='ppt'" :dragDomFunc="dragDomFunc"></ppt>
                        <use-file v-else-if="appType===1" :fileData="fileData.file_data" @save="save"></use-file>
                        <component v-else-if="appType==='test'" :is="currentView" style="wifcondth: 100%;"></component>
                    </template>
                </div>
            </div>
            <div
                class="right_tools_content"
                v-show="rightToolSelect!==''"
                :style="{width:rightToolInfo[rightToolSelect]?rightToolInfo[rightToolSelect].width+'px':''}"
            >
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
                <div :class="{active:rightToolSelect=='var'}"
                     @click="rightToolSelect=(rightToolSelect==='var'?'':'var')">已添加对象
                </div>
                <div :class="{active:rightToolSelect=='data'}"
                     @click="rightToolSelect=(rightToolSelect==='data'?'':'data')">数据
                </div>
                <div :class="{active:rightToolSelect=='html'}"
                     @click="rightToolSelect=(rightToolSelect==='html'?'':'')">HTML
                </div>
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
        <!--文件选择-->
        <div v-if="isChooseFile" class="chooseFile" @click="isChooseFile=false,appType=''">
            <div class="body" @click.stop="">
                <div v-for="item in fileList" @click="selectFile(item)">
                    <div class="panel-heading" v-html="item.title"></div>
                </div>
                <div @click="createFile" style="background-color: #dce4e4;text-align: center;padding-top: 50px;">新建
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
import widgetIdToVar from './widgetIdToVar';

import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            dashboardTemplate: [
                {
                    id: 1,
                    name: 'useFile',
                    title: '保存测试'
                }
            ],
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
                    width: 400
                }
            },
            editDataType: '',
            connections: [],
            html: '',
            varToDom: new Map(),
            // 是否弹出选择文件界面
            isChooseFile: false,
            // 选择的app类型
            appType: '',
            fileList: [],
            // 保存的文件
            fileData: {}
        }
    },
    computed: {
        ...mapGetters('main', ['editObjArr']),
        saveHtml() {
            return this.html.replace(/ random-id="r(\d+)"/g, '');
        }
    },
    methods: {
        ...mapActions('main', ['setConnections', 'varHighlightSet', 'editObjArrPush', 'editObjArrPop']),
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
            console.log(varName, id, dom);
            let dragDomFunc = this.dragDomFunc;
            if(dragDomFunc === null) {
                dragDomFunc = allMatch.find(item => {
                    return item.func;
                }).name;
                dragDomFunc = 'INPUT';
            }
            let matchItem = allMatch.find(item => {
                return item.func !== undefined && dragDomFunc.match(item.match);
            });

            if(matchItem !== undefined) {
                let code = this.getCodeByMatchItem(matchItem);
                this.addData_(varName, id, dom, code);
                this.editVar(varName);
            }
            this.save();
        },
        addData_(varName, id, dom, code) {
            let insertObj = getEvalObj(1, code);
            allVar.setVar(varName, insertObj[0]);
            this.editDataType = '';
            let newVar = allVar.getVar(varName);

            // 用来设置变量映射dom
            this.varToDom.set(newVar, dom);
            // 用来映射widgetId对应存放的变量
            widgetIdToVar[id] = varName;
            let reg = new RegExp('<widget random-id="' + id + '"[^>]*>', 'g');
            this.html = this.html.replace(reg, '<widget random-id="' + id + '" data="' + varName + '">');
            this.varToDom.get(newVar).innerHTML = '';
            this.varToDom.get(newVar).appendChild(newVar.value_.dom);
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
            this.save();
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
            console.log(code);
            console.log(getEvalObj(1, code)[0]);
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
            this.save();
        },
        editVar(key) {
            console.log('-----修改变量-----');
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
            this.editObjArrPush(pushEditObj);
            if(Var.value_ instanceof relationalModel) {
                this.editDataType = 'relationalModel';
            } else {
                this.editDataType = '';
            }
        },
        hover(key, messageType) {
            this.varHighlightSet({key, 'info': messageType});
        },
        chooseApp(appType) {
            ajax({
                type: 'GET',
                url: 'http://www.tablehub.cn/app/file.html',
                data: {
                    appType: appType
                }
            }).then((data) => {
                this.isChooseFile = true;
                this.fileList = data;
                this.appType = appType;
                console.log(data);
            });
        },
        createFile() {
            let fileName = window.prompt('请输入文件名', '未命名文件');
            ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/app/file.html',
                data: {
                    appType: this.appType,
                    title: fileName
                }
            }).then((data) => {
                console.log(data);
            });
        },
        selectFile(file) {
            file.file_data = JSON.parse(file.file_data);
            file.var_data = JSON.parse(file.var_data);
            file.widget_id_to_var = JSON.parse(file.widget_id_to_var);
            // 先创建对象，保证所有对象都存在
            /*
            Object.keys(file.var_data).forEach(item => {
                let insertObj = getEvalObj(1, '""');
                allVar.setVar(item, insertObj[0]);
            });
            */
            // 先后重新赋值正确的对象
            Object.keys(file.var_data).forEach(item => {
                let insertObj = getEvalObj(1, file.var_data[item]);
                allVar.setVar(item, insertObj[0]);
            });

            // console.log('-----file.widget_id_to_var-----');
            for(let i in file.widget_id_to_var) {
                widgetIdToVar[i] = file.widget_id_to_var[i];
            }

            // let insertObj = getEvalObj(1, code);
            // allVar.setVar(varName, insertObj[0]);
            console.log(file.var_data);
            this.fileData = file;
            this.isChooseFile = false;
        },
        save() {
            let allData = allVar.getAllData();
            let saveData = {};
            for (let i in allData) {
                saveData[i] = getStrByObj(allData[i].value_);
            }
            ajax({
                type: 'PUT',
                url: 'http://www.tablehub.cn/app/file.html',
                data: {
                    id: this.fileData.id,
                    file_data: JSON.stringify(this.fileData.file_data),
                    widgetIdToVar: JSON.stringify(widgetIdToVar),
                    allVar: JSON.stringify(saveData)
                }
            }).then((data) => {
                console.log(data);
            });
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
        widgetEvent.on('insertByCode', this.addData_);
        widgetEvent.on('init', this.dataInit);
        widgetEvent.on('editVar', this.editVar);
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
        'useFile': useFile
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
        overflow: auto;
    }

    #content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow: scroll;
        > div {
            flex-grow: 1;
            position: relative;
            overflow: auto;
            background-color: #f9f9f9;
            height: 100%;
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

    .chooseFile {
        width: 100%;
        height: 100%;
        background-color: #0000002e;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        .body {
            width: 500px;
            height: 300px;
            padding: 20px;
            background-color: white;
            > * {
                float: left;
                width: 200px;
                height: 130px;
                margin: 0 5px 20px 5px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
                -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
                box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
                .panel-heading {
                    padding: 10px 15px;
                    border-bottom: solid 1px #ddd;
                    background-color: #f5f5f5;
                }
            }
        }
    }
</style>
