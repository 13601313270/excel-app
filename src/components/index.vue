<template>
    <div style="display: flex;width: 100%;height: 100%;">
        <div style="width: 200px;border-right: solid 1px black;text-align: center;background-color: #333;color:#999">
            <h2>表单</h2>
            <div draggable="true" @dragstart='drag("INPUT")'>输入框</div>
            <div draggable="true" @dragstart='drag("INPUT_DATE")'>日期</div>
            <!--<div draggable="true" @dragstart='drag($event)'>下拉框</div>-->
            <div draggable="true" @dragstart='drag("INPUT")'>开关器</div>
            <div draggable="true" @dragstart='drag("TEXT")'>文本</div>

            <h2>图表</h2>
            <div draggable="true" @dragstart='drag("BAR")'>柱状图</div>

            <h2>计算</h2>
            <div draggable="true" @dragstart='drag("MIN")'>最小值</div>
        </div>
        <div v-if="insertVarName!==''"
             style="position: fixed;z-index: 2;top:0%;left:0;right:0;bottom:0;display: flex;justify-content:center;align-items:center;background-color: rgba(103, 103, 103, 0.59);">
            <div style="background-color: white;border-radius: 5px;padding: 5px;position: relative;">
                <div>对象：{{insertVarName}}
                    <div @click="insertVarName=''"
                         style="position: absolute;right: 0px;top: 0;background-color: grey;width: 20px;color: white;text-align: center;">
                        X
                    </div>
                </div>
                <props-com @change="codeUpdate"
                           ref="insertProps"
                           v-model="insertProps"
                           style="min-height: 250px;"></props-com>
                <div>
                    <textarea @change="codeUpdate($event.target.value)"
                              :value="insertCode"
                              style="height: 50px;width: 100%;box-sizing: border-box;"></textarea>
                </div>
            </div>
        </div>
        <div style="flex-grow:1;display: flex;flex-direction: column;" id="content">
            <div style="flex-grow: 1;background-color: #f9f9f9;padding: 10px;">
                <component :is="currentView" style="width: 100%;"></component>
            </div>
            <div style="display: flex;">
                <div style="flex-grow: 1;padding: 3px 3px;">
                    <all-vars></all-vars>
                </div>
                <textarea :value="saveHtml"
                          style="flex-grow: 1;width: 400px;height:200px;"></textarea>
            </div>

        </div>
    </div>
</template>

<script>
import evalObjAndStr from '../evalObjAndStr';
import Obj from '../observer/obj';
import allMatch from '../allMatch';
import allVar from '../allVar';
import INPUT from '../widget/INPUT';
import INPUT_DATE from '../widget/INPUT_DATE';
import TEXT from '../widget/TEXT';
import MIN from '../widget/MIN';
import BAR from '../widget/BAR';

import dashboard from './dashboard';
import allVars from './allVars.vue';
import propsCom from './props.vue';

class Var extends Obj {
    get value() {
        if (this.value_ instanceof Obj) {
            return this.value_.value;
        } else {
            return this.value_;
        }
    }

    set value(value) {
        this.dep.lock();
        // 释放原有的监听
        if (this.value_ instanceof Obj) {
            this.dep.unListen(this.value_.dep);
        }
        this.value_ = value;
        if (value instanceof Obj) {
            this.dep.listen(value.dep);
        }
        this.dep.update();// release
    }
}

allMatch.push(INPUT);
allMatch.push(INPUT_DATE);
allMatch.push(TEXT);
allMatch.push(BAR);
allMatch.push(MIN);

export default {
    data() {
        return {
            allVar: allVar,
            currentView: dashboard(),
            dragDomFunc: undefined,
            insertProps: {},
            insertCode: '',
            insertVarName: '',
            html: ''
        }
    },
    components: {
        'all-vars': allVars,
        'props-com': propsCom
    },
    computed: {
        saveHtml() {
            return this.html.replace(/ random-id="r(\d+)"/g, '');
        }
    },
    methods: {
        codeUpdate(code) {
            this.insertCode = code;
            let widgePanel = allVar.getVar(this.insertVarName).value_.dom.parentNode;
            allVar.getVar(this.insertVarName).value_.dom.remove();
            let insertObj = evalObjAndStr(1, code);
            allVar.getVar(this.insertVarName).codeText = code;
            allVar.getVar(this.insertVarName).value = insertObj[0];
            widgePanel.appendChild(allVar.getVar(this.insertVarName).value_.dom);
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
        }
    },
    mounted() {
        let fileContent = `$a1 = BAR()`;
        fileContent = '';
        this.html = `<div>
    <div>
        <div><h4>时间</h4><widget></widget><widget></widget></div>
        <div><h4>人民币</h4><widget></widget></div>
        <div><h4>汇率</h4><widget></widget></div>
        <div><h4>美元</h4><widget></widget></div>
        <div><widget></widget></div>
        <div><widget></widget></div>
    </div>
</div>`;

        evalObjAndStr(1, fileContent);
        this.allVar = allVar;

        let this_ = this;

        window.addData = function(id) {
            for (let i = 0; i < allMatch.length; i++) {
                let item = allMatch[i];
                if (item.type === 'function' && this_.dragDomFunc.match(item.match)) {
                    // console.log(item);
                    let code = '';
                    if (item.type === 'function') {
                        code += item.name + '(';
                        let propsArr = [];
                        item.props.forEach((item) => {
                            let item2 = item;
                            let isArr = false;
                            if (item2.dataType instanceof Array) {
                                isArr = true;
                                item2.dataType = item2.dataType[0];
                            }
                            let pushProp = '';
                            if (item2.enum) {
                                for (let j in item2.enum) {
                                    pushProp = '"' + j + '"';
                                    break;
                                }
                            } else if (item2.dataType === 'number') {
                                pushProp = 1;
                            } else if (item2.dataType === 'string') {
                                pushProp = '""';
                            } else {
                                pushProp = 'TRUE';
                            }
                            propsArr.push(pushProp);
                            if (isArr) {
                                propsArr.push(pushProp);
                                propsArr.push(pushProp);
                                propsArr.push(pushProp);
                                propsArr.push(pushProp);
                                item2.dataType = [item2.dataType];
                            }
                        });
                        code += propsArr.join(',');
                    }
                    code += ')';
                    let newVarName = '$' + window.prompt('请输入名称', 'a7').replace(/^\$/, '');
                    this_.insertVarName = newVarName;
                    let insertObj = evalObjAndStr(1, code);
                    allVar.setVar(newVarName, new Var());
                    allVar.getVar(newVarName).codeText = code;
                    allVar.getVar(newVarName).value = insertObj[0];
                    // console.log(insertObj[0]);
                    this_.insertProps = insertObj[0];
                    this_.insertCode = code;
                    // evalObjAndStr(1, newVarName + ' = ' + code);
                    let reg = new RegExp('<widget random-id="' + id + '"[^>]*>', 'g');
                    this_.html = this_.html.replace(reg, '<widget random-id="' + id + '" data="' + newVarName + '">');
                    return allVar.getVar(newVarName);
                }
            }
        };

        let newDash = dashboard();
        this.html = this.html.replace(/<widget([ |>])/g, function(a, b) {
            return '<widget random-id="r' + parseInt(Math.random() * 1000000) + '"' + b;
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
