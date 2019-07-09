<template>
    <div class="content" @dragend="cancelDragDomFunc">
        <div class="head" v-show="!isFullScreen">
            <div style="display: flex;align-items: center;margin-right: 50px;">
                <span>开启修改</span>
                <img
                    style="width: 55px;height: 20px;"
                    @click="isEditing = !isEditing"
                    :src="isEditing?'https://n4-q.mafengwo.net/s10/M00/18/A2/wKgBZ1jc3R6AYhi_AAB-2Jyz1WU027.png':'https://c2-q.mafengwo.net/s10/M00/18/1D/wKgBZ1jc3A-AKDulAABm0wptOh4037.png'"/>
            </div>
            <ui-button @click="fullScreen" size="mini" icon="&#xe657;">全屏</ui-button>
            <div v-if="writeColumnList.length>0" class="write_column">
                <span style="line-height: 28px;">手填数据：</span>
                <ui-button
                    v-for="item in writeColumnList"
                    @click="insertWrite(item)"
                    :key="item.id"
                    size="mini">{{item.name}}</ui-button>
            </div>
        </div>
        <!--<header-nav></header-nav>-->
        <div class="app_page">
            <div class="left_tools" v-if="isEditing">
                <div :class="{active:leftToolSelect=='widget'}"
                     @click="leftToolSelect=(leftToolSelect==='widget'?'':'widget')">控件
                </div>
                <div :class="{active:leftToolSelect=='widget22'}"
                     @click="leftToolSelect=(leftToolSelect==='widget22'?'':'widget22')">布局
                </div>
            </div>
            <div class="left_tools_content" v-if="isEditing && leftToolSelect!==''"
                 :style="{width:leftToolInfo[leftToolSelect]?leftToolInfo[leftToolSelect].width+'px':''}">
                <tools_widget v-if="leftToolSelect=='widget'" @drag='dragWidget'></tools_widget>
                <div v-else-if="leftToolSelect=='widget22'"></div>
            </div>
            <div id="app_content" :class="{edit:isEditing}">
                <div
                    v-if="appType && fileData.file_data"
                    :is="appType"
                    :dragDomFunc="dragDomFunc"
                    :isFullScreen="isFullScreen"
                    :dragDomFuncInfo="getWidgetInfoByName(dragDomFunc)"
                    :fileData="fileData.file_data"
                    :isEditing="isEditing"
                    class="used-dashboard"
                    @eval="eval"
                    @saveVar="saveVar"
                    @createVar="createVar"
                    @editVar="editVar"
                ></div>
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
                    @createVar="createVar"
                ></datas-vue>
                <connection-vue
                    v-show="rightToolSelect=='connection'"
                    :connections="connections"
                >
                </connection-vue>
                <div
                    v-show="rightToolSelect=='var'">
                    <div style="flex-grow: 1;padding: 3px 3px;overflow: auto">
                        <all-vars
                            @change="editVar"
                            :useCreateVar="useCreateVar"
                            :varToWidget="varToWidget"
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
                <div :class="{active:rightToolSelect=='connection'}"
                     @click="rightToolSelect=(rightToolSelect==='connection'?'':'connection')">数据源
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
                    <div class="close_button" @click="editObjArrPop">X</div>
                </div>
                <props-com
                    @change="item.change(item)"
                    v-model="editObjArr[key].obj"
                    :dataType="item.dataType"
                    :is-root="true"
                    style="min-height: 250px;"
                ></props-com>

                <div v-if="editObjArr[key].obj.type === 'function' && editObjArr[key].obj.name === 'RELATIONAL_MODEL'">
                    可视化数据
                    <div v-html="getRelationalModel(item.name)"></div>
                </div>
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
import '../widget/COLUMN_BAR';
import '../widget/LINE';
import '../widget/RADAR';
import '../widget/PIE';
import '../widget/TABLE';
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
import allPageVars from './allVars.vue';
import propsCom from './props/props.vue';
import Obj from '../observer/obj';
import getStrByObj from '../languageParser/getStrByObj';
import datasVue from './tools/datas.vue';
import connectionVue from './tools/connection.vue';
import getOptionByObj from './props/getPropsOptionByObj';
import { createCodeText } from './props/createCodeText';

import ajax from '../api/ajax';
import widgetEvent from './widgetChange';

import dashboardList from './dashboardList';

import { mapActions, mapGetters } from 'vuex';

import Vue from 'vue';
import widget from './widget.vue';

import dynamicVueObject from './dynamicVueObject/dynamicVueObject.vue';
import UiButton from './ui/button';
import axios from 'axios';
import dynamicForm from './dynamicForm/form';
// import { prompt } from './alert/prompt';
import UiInput from './ui/input';
axios.defaults.withCredentials = true;
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
                    width: 550
                },
                connection: {
                    width: 300
                }
            },
            html: '',
            varToWidget: {}, // 变量，正在绑定的widget映射
            // 选择的app类型
            appType: '',
            fileList: [],
            // 保存的文件
            fileData: {},
            useCreateVar: [], // 用户创建的变量，需要保存的
            isFullScreen: false,
            lastSaveTime: (new Date()).getTime()
        }
    },
    computed: {
        ...mapGetters('main', ['editObjArr', 'dragDomFunc', 'connections']),
        writeColumnList() {
            return this.connections.filter(item => {
                return item.type === '5';
            })
        }
    },
    methods: {
        ...mapActions('main', ['setConnections', 'varHighlightSet', 'editObjArrPush', 'editObjArrPop', 'setDragDomFunc',
            'setIsEditing', 'setDataSourceSet'
        ]),
        cancelDragDomFunc() {
            this.$nextTick(() => {
                this.setDragDomFunc(null);
            });
        },
        // 根据一个函数，生成这个函数的默认字符串，（填充默认参数）
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
                } else if(dataType.split(',').includes('boolean')) {
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
                    } else if(propsArr[j].split(',').includes('boolean')) {
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
        // 通过函数名，获取函数配置信息
        getWidgetInfoByName(name) {
            return allMatch.find(item => {
                return item.name === name;
            });
        },
        // 弹出修改某个变量的弹窗,changeDragDomFunc要修改成的变量
        createVar(varName, changeDragDomFunc) {
            let dragDomFunc;
            if (changeDragDomFunc) {
                dragDomFunc = changeDragDomFunc;
            }
            if(dragDomFunc === undefined) {
                dragDomFunc = 'INPUT';
            }
            let matchFunction = allMatch.find(item => {
                return item.func !== undefined && dragDomFunc.match(item.match);
            });
            if(matchFunction !== undefined) {
                let code = this.getCodeByMatchItem(matchFunction);
                // 新加变量
                let insertObj = getEvalObj(1, code);
                allVar.setVar(varName, insertObj[0]);
                // if (widgetId !== undefined || dom !== undefined || vueDom !== undefined) {
                //     this.bindVarToWidget(varName, vueDom);
                // }
                // 弹出编辑变量的窗口
                this.editVar(varName);
                if(!this.useCreateVar.includes(varName)) {
                    this.useCreateVar.push(varName);
                }
            }
            this.cancelDragDomFunc();
            this.save();
        },
        // 给某个widget绑定数据
        bindVarToWidget(varName, widget) {
            let newVar = allVar.getVar(varName);
            widget.setBindVar(newVar);
            if (newVar.value_.dom instanceof Array) {
            } else {
                // 用来设置变量映射dom
                this.varToWidget[varName] = widget;
            }
        },
        // 清除某个widget绑定的数据
        clearVarOnWidget(varName) {
            this.$delete(this.varToWidget, varName.name);
        },
        // widget实例被创建，完成了数据初始化
        widgetInit(varName, widget) {
            if (allVar.getVar(varName)) { // 创建了一个widget，并且绑定了变量
                this.varToWidget[varName] = widget;
            } else { // 创建了一个widget，但是widget里面没有内容
                this.save();
            }
        },
        // 通过变量对象，修改生成的code，并且修改对应的widget内容
        codeUpdate(editObj) {
            let editVarName = editObj.name;
            editObj.code = createCodeText(editObj.obj);
            if(editVarName !== undefined) {
                let updateVar = allVar.getVar(editVarName);
                let insertObj = getEvalObj(1, editObj.code);
                allVar.setVar(editVarName, insertObj[0]);
                let widgePanel = this.varToWidget[editVarName];
                if(widgePanel !== undefined) {
                    let value_ = updateVar.value_;
                    if(value_ instanceof Obj) {
                        if(value_.dom) {
                            widgePanel.innerHTML = '';
                            widgePanel.setBindVar(updateVar);
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
        // 开始拖拽左侧的图表
        dragWidget(func) {
            this.setDragDomFunc(func);
        },
        allowDrop(e) {
            e.preventDefault();
        },
        // 修改代码输入框的内容
        changeCode(obj, code) {
            // 修改完的代码，生成obj，再生成回来，可以保证上面的可视化编辑也被修改，而且再次生成的code，格式会更好
            let newObj = getOptionByObj(getEvalObj(1, code)[0]);
            // MIN(1,MIN(2,4),1)
            // 不能直接覆盖obj.obj，因为js是引用赋值
            obj.obj.type = newObj.type;
            obj.obj.props = newObj.props;
            this.codeUpdate(obj);
            if(obj.parent !== undefined) {
                obj.parent.emitChange();
            }
            this.save();
        },
        // dashboard内部可以调用 代码识别
        eval(evalContent) {
            getEvalObj(1, evalContent);
        },
        saveVar(varName, code) {
            console.log(varName, code);
            let insertObj = getEvalObj(1, code);
            allVar.setVar(varName, insertObj[0]);
            if(!this.useCreateVar.includes(varName)) {
                this.useCreateVar.push(varName);
            }
        },
        // 点击修改某个变量
        editVar(key) {
            // Key，被修改的变量名称
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
        },
        deleteVar(key) {
            console.log('删除了变量', key);
            if(this.useCreateVar.includes(key)) {
                this.useCreateVar.splice(this.useCreateVar.findIndex(index => index === key), 1);
            }
            this.save();
        },
        varHover(key, messageType) {
            this.varHighlightSet({key, 'info': messageType});
        },
        selectFile(file) {
            file.file_data = JSON.parse(file.file_data);
            file.var_data = JSON.parse(file.var_data);
            // 先创建对象，保证所有对象都存在
            Object.keys(file.var_data).forEach(item => {
                let insertObj = getEvalObj(1, '""');
                allVar.setVar(item, insertObj[0]);
            });
            // 先后重新赋值正确的对象
            Object.keys(file.var_data).forEach(item => {
                let insertObj = getEvalObj(1, file.var_data[item].toString());
                allVar.setVar(item, insertObj[0]);
                if(!this.useCreateVar.includes(item)) {
                    this.useCreateVar.push(item);
                }
            });

            // let insertObj = getEvalObj(1, code);
            // allVar.setVar(varName, insertObj[0]);
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
                let actionTime = (new Date()).getTime();
                if(actionTime > this.lastSaveTime) {
                    this.lastSaveTime = actionTime;
                }
                setTimeout(() => {
                    if(this.lastSaveTime === actionTime) {
                        ajax({
                            type: 'PUT',
                            url: 'http://www.tablehub.cn/app/file.html',
                            data: {
                                id: this.fileData.id,
                                file_data: JSON.stringify(this.fileData.file_data),
                                allVar: JSON.stringify(saveData)
                            }
                        }).then((data) => {
                            // console.log(data);
                        });
                    }
                }, 1000);
            }
        },
        getRelationalModel(varName) {
            let newVar = allVar.getVar(varName);
            return newVar.value.toString();
        },
        fullScreen() {
            this.isFullScreen = true;
            let el = document.documentElement;
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if(typeof rfs !== 'undefined' && rfs) {
                rfs.call(el);
            }
        },
        isFullscreen() {
            return document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement || false;
        },
        insertWrite(column) {
            let formData = JSON.parse(column.info.column);
            formData.forEach(item => {
                if(item.type === 'number') {
                    item.type = Number;
                } else if(item.type === 'string') {
                    item.type = String;
                } else if(item.type === 'date') {
                    item.type = Date;
                } else if(item.type === 'boolean') {
                    item.type = Boolean;
                }
                item.title = item.name;
            });
            dynamicForm(formData).then(data => {
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };
                let param = new FormData();
                param.append('id', column.id);
                param.append('action', 'insertData');
                param.append('type', 5);
                param.append('data', JSON.stringify(data));
                axios.put('http://www.tablehub.cn/action/mysql.html', param, config)
                    .then(data => {
                        if (data.data === 1) {
                            Object.values(allVar.allData).forEach(item => {
                                if (item.value_ instanceof relationalModel) {
                                    if (parseInt(item.value_.props[0]) === parseInt(column.id)) {
                                        item.value_.dep.update();
                                    }
                                }
                            });
                        }
                    });
            });
        }
    },
    mounted() {
        ajax({
            type: 'POST',
            url: 'http://www.tablehub.cn/action/connection.html',
            data: {
                type: 'getConnections'
            }
        }).then((data) => {
            this.setConnections(data.connection);
            data.dataSource.forEach((item, key) => {
                item.column.forEach((item2, key2) => {
                    if(item2.type) {
                        data.dataSource[key].column[key2].type = ((type) => {
                            if(type === 'Number') {
                                return Number;
                            } else if(type === 'File') {
                                return File;
                            }
                            return type;
                        })(item2.type);
                    }
                });
            })
            this.setDataSourceSet(data.dataSource);
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
            console.log(this.$route.params);
            let appType = dashboardList.find(item => {
                return item.id === parseInt(this.$route.params.appType);
            });
            appType.components().then(app => {
                this.appType = app.default;
            });
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
        this.html = this.html.replace(/<widget([ |>])/g, function(a, b) {
            return '<widget random-id="r' + parseInt(Math.random() * 1000000) + '"' + b;
        });

        widgetEvent.on('init', this.widgetInit);
        widgetEvent.on('createVar', this.createVar);
        widgetEvent.on('editVar', this.editVar);
        widgetEvent.on('bindVarToWidget', this.bindVarToWidget);
        widgetEvent.on('clearVarOnWidget', this.clearVarOnWidget);

        // 检测全屏
        this.setIntervalObj = setInterval(() => {
            if(this.isFullscreen() === false) {
                this.isFullScreen = false;
            }
        }, 1000);
    },
    destroyed() {
        // widgetEvent.removeAllListeners();
        // allVar.clear();
    },
    watch: {
        isEditing(val) {
            this.setIsEditing(val);
        },
        'fileData.file_data.widget': {
            handler(val) {
                this.save();
            },
            deep: true
        }
    },
    components: {
        UiInput,
        UiButton,
        'all-vars': allPageVars,
        'props-com': propsCom,
        'datas-vue': datasVue,
        'header-nav': headerNav,
        'tools_widget': toolsWidget,
        'dynamic-vue': dynamicVueObject,
        connectionVue
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
        min-width: 130px;
        display: flex;
        flex-direction: column;
        .head {
            background-color: #e6e6e6;
            padding: 3px;
            display: flex;
            align-items: center;
            > * {
                margin-right: 10px;
            }
            .write_column {
                display: inherit;
                > * {
                    margin-right: 5px;
                }
            }
        }
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
                padding-top: 1px;
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
                        border: solid 1px #4f4f4f;
                        border-right: none;
                        &:hover {
                            box-shadow: none;
                        }
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
                // display: flex;
                flex-direction: column;
                overflow: scroll;
                background-color: grey;
                &.edit {
                    padding: 32px;
                    > div {
                        box-shadow: 0 0 20px 0 #4f4f4f;
                    }
                }
                .used-dashboard {
                    position: relative;
                    min-height: 100%;
                    // overflow: hidden;一定不能加，悬浮tip无法显示
                }
                > div {
                    /*flex-grow: 1;*/
                    display: inline-block;
                    min-width: 100%;
                    white-space: nowrap;
                    position: relative;
                    // overflow: auto;
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
                padding-top: 1px;
                > * {
                    word-wrap: break-word;
                    margin: 0 1px 2px 0;
                    padding: 14px 2px;
                    border-radius: 0 5px 5px 0;
                    text-align: center;
                    cursor: default;
                    line-height: 18px;
                    color: #b1b1b1;
                    user-select: none;
                    &.active {
                        background: #333333;
                        margin-left: -1px;
                        color: white;
                        border: solid 1px #4f4f4f;
                        border-left: none;
                        &:hover {
                            box-shadow: none;
                        }
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
            .close_button {
                position: absolute;
                right: 0;
                top: 0;
                background-color: grey;
                color: white;
                text-align: center;
                border-radius: 0 0 0 4px;
                width: 30px;
                cursor: pointer;
                &:hover {
                    background-color: #d76327;
                    color: white;
                }
            }
        }
    }
</style>
