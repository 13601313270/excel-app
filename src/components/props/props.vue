<template>
    <div class="prop">
        <table>
            <tbody>
            <template v-if="innerOption.type === 'function'">
                <tr>
                    <td>函数</td>
                    <!--{{innerOption.name}}-->
                    <td>
                        <select-type
                            :value="innerOption.name"
                            @change="changeType"
                            :dataType="dataType"
                        ></select-type>
                        <div style="float: right;" v-if="!isRoot && singlePanelName.includes(innerOption.name)">
                            <button
                                @click="editRelationalModel(innerOption,codeOption.returnType)">编辑模型
                            </button>
                        </div>
                    </td>
                </tr>
                <template v-if="!(!isRoot && singlePanelName.includes(innerOption.name))">
                    <tr v-for="(value,key) in innerOption.props">
                        <td v-html="key>=codeOption.props.length?codeOption.props[codeOption.props.length-1].title:codeOption.props[key].title"></td>
                        <td>
                            <!--类似MIN的不限量参数-->
                            <template
                                v-if="key>=codeOption.props.length-1 && getDataType(codeOption.props.length-1) instanceof Array">
                                <select v-if="codeOption.props[codeOption.props.length-1].enum">
                                    <option v-for="title,val in codeOption.props[codeOption.props.length-1].enum"
                                            :value="val">{{title}}
                                    </option>
                                </select>
                                <inner-dom @change="emitChange" v-model="innerOption.props[key]"
                                           :dataType="getDataType(codeOption.props.length-1)[0]"></inner-dom>


                                <template v-if="key==innerOption.props.length-1">
                                    <button @click="addProp(getDataType(codeOption.props.length-1)[0])">添加</button>
                                </template>
                            </template>
                            <!--枚举形式-->
                            <select v-else-if="codeOption.props[key].enum" v-model="innerOption.props[key]"
                                    @change="changeProp">
                                <option v-for="title,val in codeOption.props[key].enum" :value="val">{{title}}</option>
                            </select>
                            <template v-else>
                                <replace
                                    :type="innerOption.name+'=>'+codeOption.props[key].name"
                                    @change="emitChange"
                                    :props="innerOption.props"
                                    v-model="innerOption.props[key]"
                                    :dataType="getDataType(key)"
                                >
                                    <inner-dom
                                        slot="default"
                                        @change="emitChange"
                                        v-model="innerOption.props[key]"
                                        :dataType="getDataType(key)"
                                    ></inner-dom>
                                </replace>
                                <!--<div v-html="innerOption.name"></div>-->
                                <!--<div v-html="codeOption.props[key].name"></div>-->
                            </template>
                        </td>
                        <!--<td v-html="JSON.stringify(codeOption.props[key])"></td>-->
                    </tr>
                </template>
            </template>
            <template v-else>
                <tr>
                    <template v-if="typeof innerOption==='number'||typeof innerOption==='string'">
                        <td :style="tdStyle">
                            <select-type
                                :value="typeof innerOption"
                                @change="changeType"
                                :dataType="dataType"
                            ></select-type>
                            <input :value="innerOption" v-if="typeof innerOption==='number'"
                                   @change="setInnerOption(parseFloat($event.target.value))"/>
                            <input :value="innerOption" v-else
                                   @change="setInnerOption($event.target.value.toString())"/>
                        </td>
                    </template>
                    <template v-else-if="typeof innerOption==='boolean'">
                        <td :style="tdStyle">
                            <select-type
                                :value="innerOption===true?'TRUE':'FALSE'"
                                @change="changeType"
                                :dataType="dataType"
                            ></select-type>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='array'">
                        <td :style="tdStyle">数组</td>
                        <td :style="tdStyle">
                            <template v-for="(item,key) in innerOption.props">
                                <div style="position:relative;padding-right: 15px;">
                                    <inner-dom v-model="innerOption.props[key]" @change="emitChange"
                                               :dataType="dataType.match(/array\((.*)\)/)[1]"></inner-dom>
                                    <div class="closeButton"
                                         @click="innerOption.props.splice(key,1),emitChange()">X
                                    </div>
                                </div>
                                <template v-if="key==innerOption.props.length-1">
                                    <button @click="addProp(dataType.match(/array\((.*)\)/)[1])">添加</button>
                                </template>
                            </template>
                            <template v-if="innerOption.props.length==0">
                                <button @click="addProp(dataType.match(/array\((.*)\)/)[1])">添加</button>
                            </template>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type === 'var'">
                        <td :style="tdStyle">
                            <!--<div v-html="dataType"></div>-->
                            <select-type
                                :value="innerOption.type"
                                @change="changeType"
                                :dataType="dataType"
                            ></select-type>
                            <select :value="innerOption.name"
                                    @change="changeVar($event.target.value)">
                                <option v-for="item,key in allVar" :value="key" v-if="(dataType.includes('relationalModel') && item.value.type === 'relationalModel') || !dataType.includes('relationalModel')">
                                    【{{key}}】{{typeof item.value == 'object' ? '' : ('---' + item.value)}}
                                </option>
                            </select>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='dict'">
                        <td :style="tdStyle">字典</td>
                        <td :style="tdStyle">
                            <div class="dictList">
                                <div v-for="(item,key) in innerOption.props">
                                    <div class="key" v-html="key"></div>
                                    <div>:&nbsp;</div>
                                    <div>
                                        <!--:dataType="getDataType(key)"-->
                                        <inner-dom @change="emitChange"
                                                   v-model="innerOption.props[key]"
                                                   :dataType="''"
                                        ></inner-dom>
                                    </div>
                                </div>
                                <div>
                                    <div class="key">
                                        <button
                                            @click="innerOption.props[prompt('请输入键名', 'a7')]='val',emitChange()"
                                        >添加
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='dictionaryGet'">
                        <template v-if="innerOption.dictionary.type='var'">
                            <td :style="tdStyle">
                                <select-type
                                    :value="innerOption.dictionary.type"
                                    @change="changeType"
                                    :dataType="dataType"
                                ></select-type>
                            </td>
                            <td :style="tdStyle">
                                <select :value="innerOption.dictionary.name"
                                        @change="changeVar($event.target.value)">
                                    <option v-for="item,key in allVar" :value="key">
                                        【{{key}}】{{typeof item.value == 'object' ? '' : ('---' + item.value)}}
                                    </option>
                                </select>
                            </td>
                            <td :style="tdStyle">
                                <select @change="emitChange()" v-model="innerOption.key">
                                    <option v-for="item,key in innerOption.keys" :value="key">
                                        【{{key}}】--{{item}}
                                    </option>
                                </select>
                            </td>
                        </template>
                        <template v-else>
                            <td :style="tdStyle">字典获取</td>
                            <td :style="tdStyle">
                                <inner-dom @change="changeDictObj"
                                           v-model="innerOption.dictionary"
                                           :dataType="''"
                                ></inner-dom>

                                <select @change="emitChange()" v-model="innerOption.key">
                                    <option v-for="item,key in innerOption.keys" :value="key">
                                        【{{key}}】--{{item}}
                                    </option>
                                </select>
                            </td>
                        </template>
                    </template>
                    <template v-else-if="innerOption.type==='runObj'">
                        <td class="runObj" :style="tdStyle">
                            <span class="gongshi">公式</span>
                            <template v-for="(item,key) in innerOption.props">
                                <span v-if="['boolean', 'number', 'string'].includes(typeof createCodeSingle(item))"
                                      v-html="createCodeSingle(item)"></span>
                                <button
                                    v-else
                                    @click="editRelationalModel(innerOption.props[key],'')"
                                >
                                    {{createRunObjItem(item)}}
                                </button>
                            </template>
                        </td>
                    </template>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>
<script>
import innerDom from './props.vue';
import allMatch from '../../languageParser/allMatch';
import allVar from '../../observer/allVar';
// import getStrByObj from '../getStrByObj';
import selectType from './typeSelect.vue';
import getOptionByObj from './getPropsOptionByObj';
import { createCodeText, createRunObjItem } from './createCodeText';
import replace from './replace.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'innerDom',
    props: {
        value: {},
        isRoot: Boolean,
        dataType: String,
        tdStyle: {}
    },
    components: {
        innerDom, selectType, replace
    },
    computed: {
        ...mapGetters('main', ['editObjArr'])
    },
    watch: {
        value(val) {
            this.innerOption = val;
            this.initCodeOption();
        }
    },
    data() {
        // 'RELATIONAL_MODEL'
        return {
            name: '',
            innerOption: {},
            codeOption: {},
            allMatch: {},
            allVar: allVar.getAllData(),
            singlePanelName: ['RELATIONAL_MODEL']
        };
    },
    mounted() {
        this.allMatch = allMatch;
        this.innerOption = this.value;
        this.initCodeOption();
        if(this.innerOption.type === 'var') {
            // 如果变量值是字典，则展开下一级选择
            this.changeVar(this.innerOption.name);
        }
    },
    methods: {
        ...mapActions('main', ['editObjArrPush']),
        createRunObjItem: createRunObjItem,
        createCodeSingle(item) {
            let code = createRunObjItem(item);
            if(item.type === 'function' || code.length > 10) {
                return item;
            } else {
                return code;
            }
        },
        initCodeOption() {
            if(this.innerOption.type && ['function'].includes(this.innerOption.type)) {
                this.codeOption = this.getCodeOption(this.innerOption.name);
            }
        },
        prompt(text, defaultVal) {
            return window.prompt(text, defaultVal);
        },
        getDataType(key) {
            if(typeof this.codeOption.props[key].dataType === 'function') {
                return this.codeOption.props[key].dataType(this.innerOption.props);
            } else {
                return this.codeOption.props[key].dataType;
            }
        },
        emitChange() {
            this.$emit('input', this.innerOption);// 根目录不用，但是子元素修改完修改影响父层
            this.$emit('change');
        },
        setInnerOption(val) {
            this.innerOption = val;
            this.emitChange();
        },
        getCodeOption(name) {
            for (let i = 0; i < this.allMatch.length; i++) {
                if(name.match(this.allMatch[i].match)) {
                    return this.allMatch[i];
                }
            }
        },
        getDefaultValueByType(type) {
            if(type === 'number') {
                return 0;
            } else if(type === 'string') {
                return '';
            } else if(type === 'bool') {
                return true;
            } else if(type === 'dict') {
                return {
                    type: 'dict',
                    props: {}
                };
            } else if(type === 'array') {
                return {
                    type: 'array',
                    props: []
                }
            } else {
                return '';
            }
        },
        editRelationalModel(childObj, returnType) {
            this.editObjArrPush({
                code: createCodeText(childObj),
                parent: this,
                change: (code) => {
                    let updateObj = this.editObjArr[this.editObjArr.length - 1];
                    console.log(updateObj);
                    console.log(code);
                    if(updateObj.obj === childObj) {
                        updateObj.code = createCodeText(updateObj.obj);
                    }
                    this.emitChange();
                },
                obj: childObj,
                dataType: returnType
            });
        },
        addProp(dataType) {
            let dataTypeNew = dataType.split(',')[0];
            if(dataTypeNew === 'number') {
                this.innerOption.props.push(1);
            } else if(dataTypeNew === 'string') {
                this.innerOption.props.push('');
            } else if(dataTypeNew === 'bool') {
                this.innerOption.props.push(true);
            } else if(dataTypeNew === 'array') {
                this.innerOption.props.push([]);
            } else {
                this.innerOption.props.push('');
            }
            this.emitChange();
        },
        changeProp() {
            // dataType参数类型，支持函数返回值，这就意味着，当修改某一个类型的时候，可能会影响其他的类型，所以重新计算对应类型的默认值
            for (let i = 0; i < this.allMatch.length; i++) {
                if(this.innerOption.name.match(this.allMatch[i].match)) {
                    this.codeOption = this.allMatch[i];
                    this.codeOption.props.forEach((item, key) => {
                        if(typeof item.dataType === 'function') {
                            // this.innerOption.props并不是原始的Obj格式
                            let dataType = item.dataType(this.innerOption.props);
                            let replace = false;
                            if(['number', 'string', 'boolean'].includes(typeof this.innerOption.props[key])) {
                                if(!dataType.split(',').includes(typeof this.innerOption.props[key])) {
                                    replace = true;
                                }
                            } else if(this.innerOption.props[key] instanceof Array) {
                                if(!dataType.split(',').includes('bool')) {
                                    replace = true;
                                }
                            }
                            if(replace) {
                                if(dataType.split(',').includes('number')) {
                                    this.innerOption.props[key] = 1;
                                } else if(dataType.split(',').includes('string')) {
                                    this.innerOption.props[key] = '';
                                } else if(dataType.split(',').includes('bool')) {
                                    this.innerOption.props[key] = true;
                                } else if(dataType.split(',').includes('array')) {
                                    this.innerOption.props[key] = [];
                                }
                            }
                        }
                    });
                    this.emitChange();
                }
            }
        },
        getDefaultOption(name) {
            // codeOption.props
            let returnVal;
            if(name === 'var') {
                returnVal = 1;
                // 需要增加保证i不等于自己的逻辑
                for (let i in this.allVar) {
                    returnVal = {
                        type: 'var',
                        name: i
                    };
                    break;
                }
            } else if(['TRUE', 'FALSE'].includes(name)) {
                returnVal = (name === 'TRUE');
            } else if(['number', 'string', 'dict', 'array'].includes(name)) {
                returnVal = this.getDefaultValueByType(name);
            } else {
                returnVal = {
                    name: name,
                    props: []
                };
                this.allMatch.filter(item => {
                    return name.match(item.match);
                }).forEach(item => {
                    // this.codeOption = item;
                    returnVal.type = item.type;
                    item.props.forEach((item) => {
                        let dataType = item.dataType;
                        if(dataType instanceof Array) {
                            dataType = dataType[0];
                        } else if(dataType instanceof Function) {
                            dataType = dataType(returnVal.props);
                        }
                        let firstType = dataType.split(',')[0];
                        if(firstType.match(/array\((.*)\)/)) {
                            firstType = 'array';
                        }
                        if(item.enum) {
                            for (let j in item.enum) {
                                returnVal.props.push(j);
                                break;
                            }
                        } else if(typeof dataType === 'function') {
                            returnVal.props.push(dataType);
                        } else {
                            returnVal.props.push(this.getDefaultValueByType(firstType));
                        }
                    });
                });
                for (let i = 0; i < returnVal.props.length; i++) {
                    if(typeof returnVal.props[i] === 'function') {
                        returnVal.props[i] = returnVal.props[i](returnVal.props);
                        let first = returnVal.props[i].split(',')[0];
                        if(first.match(/array\((.*)\)/)) {
                            first = 'array';
                        }
                        returnVal.props[i] = this.getDefaultValueByType(first);
                    }
                }
            }
            return returnVal;
        },
        changeType(name) {
            this.allMatch.filter(item => {
                return name.match(item.match);
            }).forEach(item => {
                this.codeOption = item;
            });
            this.innerOption = this.getDefaultOption(name);
            if(this.innerOption.type === 'var') {
                // 如果变量值是字典，则展开下一级选择
                this.changeVar(this.innerOption.name);
            }
            this.emitChange();
        },
        changeVar(val) {
            let map = this.allVar[val].value;
            if(map.type === 'relationalModel') {
                let item = {
                    type: 'var',
                    name: val
                };
                this.setInnerOption(item);
            }
            else if(!(map instanceof Array) && map instanceof Object) {
                let item = {
                    type: 'dictionaryGet',
                    dictionary: getOptionByObj(this.allVar[val]),
                    keys: map
                };
                for (let i in map) {
                    item.key = i;
                    break;
                }
                this.setInnerOption(item);
            } else {
                let item = {
                    type: 'var',
                    name: val
                };
                this.setInnerOption(item);
            }
        },
        changeDictObj() {
            // ??目前只处理了dict是变量的情况，现实有更复杂的嵌套的情况
            if(this.innerOption.dictionary.type === 'var') {
                let map = this.allVar[this.innerOption.dictionary.name].value;
                if(map instanceof Array) {

                } else if(map instanceof Object) {
                    this.innerOption.keys = map;
                    for (let i in map) {
                        this.innerOption.key = i;
                        break;
                    }
                } else {
                    this.innerOption = {type: 'var', name: this.innerOption.dictionary.name}
                }
            }
            this.emitChange();
        },
        createCodeText: createCodeText
    }
}
</script>
<style scoped lang="less">
    table {
        border-collapse: collapse;
        td {
            border: solid 1px black;
            padding: 2px;
            .dictList {
                position: relative;
                margin-left: 10px;
                &:before {
                    content: '<';
                    font-weight: bold;
                    color: green;
                    background-color: white;
                    position: absolute;
                    top: 50%;
                    line-height: 8px;
                    height: 8px;
                    margin-top: -5px;
                    left: -8px;
                }
                > div {
                    border-left: solid 2px green;
                    &:first-child {
                        border-radius: 10px 0;
                    }
                    display: flex;
                    .key {
                        min-width: 70px;
                        font-weight: bold;
                        color: black;
                        padding-left: 10px;
                    }
                    &:last-child {
                        border-radius: 0 10px;
                    }
                }
            }
        }
        .runObj {
            .gongshi {
                background-color: #82b678;
                color: white;
                border-radius: 3px;
                padding: 0 2px;
                cursor: default;
            }
        }
    }

    .closeButton {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 14px;
        border: solid 1px black;
        border-left: none;
        text-align: center;
        cursor: pointer;
        &:hover {
            background-color: #e77f7e;
            border-left: solid 1px black;
            color: white;
        }
    }
</style>