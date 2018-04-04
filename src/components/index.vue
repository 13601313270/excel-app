<template>
    <div style="width: 100%;height: 100%;">
        <div style="display: flex;width: 100%;height: 100%;">
            <div
                style="width: 200px;border-right: solid 1px black;text-align: center;background-color: #333;color:#999">
                <h2>表单</h2>
                <div draggable="true" @dragstart='drag("INPUT")'>输入框</div>
                <div draggable="true" @dragstart='drag("INPUT_DATE")'>日期</div>
                <!--<div draggable="true" @dragstart='drag($event)'>下拉框</div>-->
                <div draggable="true" @dragstart='drag("CHECK_BOX")'>开关器</div>
                <div draggable="true" @dragstart='drag("TEXT")'>文本</div>

                <h2>图表</h2>
                <div draggable="true" @dragstart='drag("BAR")'>柱状图</div>

                <h2>计算</h2>
                <div draggable="true" @dragstart='drag("MIN")'>最小值</div>
                <div draggable="true" @dragstart='drag("IF")'>IF判断</div>
            </div>
            <div style="flex-grow:1;display: flex;flex-direction: column;" id="content">
                <div style="flex-grow: 1;overflow:scroll;background-color: #f9f9f9;padding: 10px;">
                    <component :is="currentView" style="width: 100%;" @addData="addData" @init="dataInit"></component>
                </div>
                <div style="display: flex;">
                    <div style="flex-grow: 1;padding: 3px 3px;overflow: scroll">
                        <all-vars @change="editVar" @hover="hover"></all-vars>
                    </div>
                    <div style="overflow: scroll;border: solid 1px black;">
                        <textarea :value="saveHtml"
                                  style="flex-grow: 1;width: 400px;height:200px;border: none"></textarea>
                    </div>
                </div>
            </div>
            <div style="width: 200px;background-color: #d0d0d0;">
                <datas-vue :connections="connections" @change="editVar"></datas-vue>
            </div>
        </div>
        <div v-if="$store.state.editObjArr.length > 0"
             style="position: fixed;z-index: 2;top:0;left:0;right:0;bottom:0;display: flex;justify-content:center;align-items:center;background-color: rgba(103, 103, 103, 0.59);">
            <div style="background-color: white;border-radius: 5px;padding: 5px;position: relative;">
                <template v-for="item,key in $store.state.editObjArr">
                    <div>对象：{{item.name}}
                        <div @click="$store.commit('editObjArrPop')"
                             style="position: absolute;right: 0px;top: 0;background-color: grey;width: 20px;color: white;text-align: center;">
                            X
                        </div>
                    </div>
                    <relational-model-props
                        v-if="editDataType==='relationalModel'" @change="codeUpdate"
                        v-model="$store.state.editObjArr[key].obj"
                        :dataType="editDataType"
                        :is-root="true"
                        style="min-height: 250px;"></relational-model-props>
                    <props-com
                        v-else @change="codeUpdate"
                        :value="$store.state.editObjArr[key].obj"
                        :dataType="editDataType"
                        :is-root="true"
                        style="min-height: 250px;"></props-com>
                </template>

                <div>
                    <textarea @change="codeUpdate($event.target.value)"
                              :value="insertCode"
                              style="height: 50px;width: 100%;box-sizing: border-box;"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import evalObjAndStr from '../languageParser/evalObjAndStr';
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
import datasVue from '../components/datas.vue';
import getOptionByObj from './props/getPropsOptionByObj';

import ajax from '../api/ajax';
export default {
    data() {
        return {
            currentView: dashboard(),
            dragDomFunc: undefined,
            editObjArr: [],
            editDataType: '',
            insertCode: '',
            connections: [],
            html: '',
            varToDom: new Map()
        }
    },
    components: {
        'all-vars': allPageVars,
        'props-com': propsCom,
        'datas-vue': datasVue,
        'relational-model-props': relationalModelProps
    },
    computed: {
        saveHtml() {
            return this.html.replace(/ @change="addData" @init="dataInit" random-id="r(\d+)"/g, '');
        }
    },
    methods: {
        getCodeByMatchItem(item) {
            let code = item.name + '(';
            let propsArr = [];
            item.props.forEach((item) => {
                let item2 = item;
                let dataType = item2.dataType;
                // let isArr = false;
                if (dataType instanceof Array) {
                    // isArr = true;
                    dataType = dataType[0];
                }
                let pushProp = '';
                if (item2.enum) {
                    for (let j in item2.enum) {
                        pushProp = '"' + j + '"';
                        break;
                    }
                } else if (typeof dataType === 'function') {
                    pushProp = dataType;
                } else if (dataType.split(',').includes('number')) {
                    pushProp = 1;
                } else if (dataType.split(',').includes('string')) {
                    pushProp = '""';
                } else if (dataType.split(',').includes('bool')) {
                    pushProp = 'TRUE';
                } else if (dataType.match(/array\((.*)\)/)) {
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
                if (typeof propsArr[j] === 'function') {
                    temp2.push(null);
                } else {
                    temp2.push(evalObjAndStr(1, propsArr[j])[0]);
                }
            }
            for (let j = 0; j < propsArr.length; j++) {
                if (typeof propsArr[j] === 'function') {
                    propsArr[j] = propsArr[j](temp2);
                    console.log(propsArr[j]);
                    if (propsArr[j].split(',').includes('number')) {
                        propsArr[j] = 1;
                    } else if (propsArr[j].split(',').includes('string')) {
                        propsArr[j] = '""';
                    } else if (propsArr[j].split(',').includes('bool')) {
                        propsArr[j] = 'TRUE';
                    } else if (propsArr[j].split(',').includes('array')) {
                        propsArr[j] = '[]';
                    }
                }
            }
            code += propsArr.join(',');
            code += ')';
            return code;
        },
        addData(varName, id, dom) {
            for (let i = 0; i < allMatch.length; i++) {
                let item = allMatch[i];
                if (item.func !== undefined && this.dragDomFunc.match(item.match)) {
                    let code = this.getCodeByMatchItem(item);
                    let insertObj = evalObjAndStr(1, code);
                    allVar.setVar(varName, insertObj[0]);
                    this.$store.commit('editObjArrPush', {
                        name: varName,
                        obj: insertObj[0]
                    });
                    // this.editObjArr.push({
                    //     name: varName,
                    //     obj: insertObj[0]
                    // });
                    this.editDataType = '';
                    this.insertCode = code;

                    let newVar = allVar.getVar(varName);
                    this.varToDom.set(newVar, dom);
                    let reg = new RegExp('<widget @change="addData" @init="dataInit" random-id="' + id + '"[^>]*>', 'g');
                    this.html = this.html.replace(reg, '<widget @change="addData" @init="dataInit" random-id="' + id + '" data="' + varName + '">');
                    this.varToDom.get(newVar).innerHTML = '';
                    this.varToDom.get(newVar).appendChild(newVar.value_.dom);
                }
            }
        },
        dataInit(varName, id, dom) {
            let initVar = allVar.getVar(varName);
            this.varToDom.set(initVar, dom);
            this.varToDom.get(initVar).innerHTML = '';
            this.varToDom.get(initVar).appendChild(initVar.value_.dom);
        },
        codeUpdate(code) {
            console.log('---------');
            console.log(code);
            this.insertCode = code;
            let editVarName = this.$store.state.editObjArr[this.$store.state.editObjArr.length - 1].name;
            console.log(editVarName);
            let updateVar = allVar.getVar(editVarName);
            let widgePanel = this.varToDom.get(updateVar);
            if (widgePanel !== undefined) {
                widgePanel.innerHTML = '';
            }
            // allVar.getVar(editVarName).value_.dom.remove();
            let insertObj = evalObjAndStr(1, code);
            allVar.setVar(editVarName, insertObj[0]);
            let value_ = updateVar.value_;
            if (widgePanel !== undefined) {
                if (value_ instanceof Obj) {
                    if (value_.dom) {
                        widgePanel.appendChild(value_.dom);
                    } else {
                        widgePanel.innerHTML = value_.value.toString();// 变量值可以直接赋予数字，字符串 布尔值
                    }
                } else {
                    widgePanel.innerHTML = value_.toString();// 变量值可以直接赋予数字，字符串 布尔值
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
        editVar(key) {
            let Var = allVar.getVar(key);
            this.$store.commit('editObjArrPush', {
                name: key,
                obj: Var.value_
            });
            if (Var.value_ instanceof relationalModel) {
                this.editDataType = 'relationalModel';
            } else {
                this.editDataType = '';
            }

            this.insertCode = getStrByObj(Var.value_);
        },
        hover(key, messageType) {
            this.$store.commit('varHighlightSet', {key, 'info': messageType});
        },
        getOptionByObj: getOptionByObj
    },
    mounted() {
        /**
         * showTables
         * showCreateTable
         * run
         * */
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

        // let fileContent = `$a1 = INPUT('number',9999)`;
        // let fileContent = `$a1 = CHECK_BOX(TRUE)`;
        // $a2 = RELATIONAL_MODEL(1,'user',$a1,['count(id)','count(id)+1'])
        //
        // id email
        let fileContent = `$a1 = INPUT('string',"10")
        $a3 = BAR(RELATIONAL_MODEL(1,'user','email',['count(id)','count(id)+1']))
        $a4 = $a3.select
        $a5 = MIN($a1,1)
        `;
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

        evalObjAndStr(1, fileContent);
        console.log(allVar);
        let newDash = dashboard();
        this.html = this.html.replace(/<widget([ |>])/g, function(a, b) {
            return '<widget @change="addData" @init="dataInit" random-id="r' + parseInt(Math.random() * 1000000) + '"' + b;
        });
        newDash.template = this.html;
        this.currentView = newDash;
    }
}
</script>
<style>
    widget {
        border: solid 1px black;
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
    }
</style>
<style scoped>
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
</style>
