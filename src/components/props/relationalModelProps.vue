<template>
    <div class="prop">
        <table v-if="codeOption.props">
            <tbody>
            <tr>
                <td>关系模型</td>
                <td></td>
            </tr>
            <tr>
                <td v-html="codeOption.props[0].title"></td>
                <td>
                    <select v-model="innerOption.props[0]">
                        <option v-for="item in $store.state.connections" v-html="item.name"
                                :value="item.id"></option>
                    </select>
                </td>
            </tr>
            <tr>
                <td v-html="codeOption.props[1].title"></td>
                <td>
                    <inner-dom
                        v-if="innerOption.props[1]"
                        @change="emitChange"
                        v-model="innerOption.props[1]"
                        :dataType="getDataType(1)"
                    ></inner-dom>
                </td>
            </tr>
            <tr>
                <td v-html="codeOption.props[2].title"></td>
                <td>
                    <inner-dom
                        v-if="innerOption.props[2]"
                        @change="emitChange"
                        v-model="innerOption.props[2]"
                        :dataType="getDataType(2)"
                    ></inner-dom>
                </td>
            </tr>
            <tr>
                <td v-html="codeOption.props[3].title"></td>
                <td>
                    <div class="y-item" v-for="item,key in innerOption.props[3].props">
                        <inner-dom
                            @change="emitChange"
                            :tdStyle="{border:'none'}"
                            v-model="innerOption.props[3].props[key]"
                            :dataType="'string,var'"
                        ></inner-dom>
                        <!--<select class="likeText">-->
                            <!--<option>count</option>-->
                            <!--<option>min</option>-->
                            <!--<option>max</option>-->
                        <!--</select>(-->
                        <!--<inner-dom-->
                            <!--@change="emitChange"-->
                            <!--:tdStyle="{border:'none'}"-->
                            <!--v-model="innerOption.props[3].props[key]"-->
                            <!--:dataType="'string,var'"-->
                        <!--&gt;</inner-dom>-->
                        <!--)-->
                        <div class="closeButton"
                             @click="innerOption.props[3].props.splice(key,1),emitChange()">X
                        </div>
                    </div>
                    <button @click="innerOption.props[3].props.push(''),emitChange()">添加</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import innerDom from './props.vue';
import allMatch from '../../languageParser/allMatch';
import allVar from '../../observer/allVar';
// import getStrByObj from '../getStrByObj';
import relationalModel from '../../widget/relationalModel';
import __array__ from '../../languageParser/array';
import __dictionary__ from '../../languageParser/dictionary';
import dictionaryGet from '../../languageParser/dictionaryGet';
import Var from '../../observer/Var';
import selectType from './typeSelect.vue';
export default {
    props: {
        value: {},
        isRoot: Boolean,
        dataType: String
    },
    components: {
        'inner-dom': innerDom,
        'select-type': selectType
    },
    computed: {},
    watch: {
        value(val) {
            this.innerOption = val;
        }
    },
    data() {
        return {
            name: '',
            innerOption: {},
            codeOption: {},
            allMatch: {},
            allVar: allVar.getAllData(),
            relationalModel: relationalModel
        };
    },
    mounted() {
        this.allMatch = allMatch;
        if (this.isRoot) {
            this.innerOption = this.getOptionByObj(this.value);
        } else {
            this.innerOption = this.value;
        }
    },
    methods: {
        prompt(text, defaultVal) {
            return window.prompt(text, defaultVal);
        },
        getDataType(key) {
            if (typeof this.codeOption.props[key].dataType === 'function') {
                return this.codeOption.props[key].dataType(this.innerOption.props);
            } else {
                return this.codeOption.props[key].dataType;
            }
        },
        emitChange() {
            this.$emit('input', this.innerOption);
            this.$emit('change', this.createCodeText(this.innerOption));
        },
        setInnerOption(val) {
            this.innerOption = val;
            this.emitChange();
        },
        getOptionByObj(obj) {
            let returnOption = {};
            if (['boolean', 'number', 'string'].includes(typeof obj)) {
                returnOption = obj;
            }
            else if (obj instanceof __array__) {
                returnOption = {
                    type: 'array',
                    props: []
                };
                obj.value_.forEach((item) => {
                    returnOption.props.push(this.getOptionByObj(item));
                });
            }
            else if (obj instanceof __dictionary__) {
                returnOption = {
                    type: 'dict',
                    props: obj.map
                };
            }
            else if (obj instanceof dictionaryGet) {
                returnOption = {
                    type: 'dictionaryGet',
                    dictionary: this.getOptionByObj(obj.dictionary),
                    keys: obj.dictionary.value,
                    key: obj.key
                };
            }
            else if (obj instanceof Var) {
                returnOption = {
                    type: 'var',
                    name: obj.name,
                    value: obj.value
                };
            }
            else {
                returnOption = {
                    type: obj.type,
                    name: obj.name,
                    props: []
                };
                obj.props.forEach(item => {
                    returnOption.props.push(this.getOptionByObj(item))
                });
                for (let i = 0; i < this.allMatch.length; i++) {
                    if (returnOption.name.match(this.allMatch[i].match)) {
                        this.codeOption = this.allMatch[i];
                        returnOption.type = this.codeOption.type;
                    }
                }
            }
            return returnOption;
        },
        getDefaultValueByType(type) {
            if (type === 'number') {
                return 0;
            } else if (type === 'string') {
                return '';
            } else if (type === 'bool') {
                return true;
            } else if (type === 'dict') {
                return {
                    type: 'dict',
                    props: {}
                };
            } else if (type === 'array') {
                return {
                    type: 'array',
                    props: []
                }
            } else {
                return '';
            }
        },
        createCodeText(innerOption) {
            let code = '';
            if (typeof innerOption === 'string') {
                code = '"' + innerOption + '"';
            }
            else if (typeof innerOption === 'number') {
                code = innerOption.toString();
            }
            else if (typeof innerOption === 'boolean') {
                code = innerOption ? 'TRUE' : 'FALSE';
            }
            else if (innerOption.type === 'array') {
                code = '[';
                let childArr = [];
                innerOption.props.forEach((item) => {
                    childArr.push(this.createCodeText(item));
                });
                code += childArr.join(',');
                code += ']';
            }
            else if (innerOption.type === 'dict') {
                let props = innerOption.props;
                code = '{';
                let childArr = [];
                for (let i in props) {
                    childArr.push(this.createCodeText(i) + ':' + this.createCodeText(props[i]));
                }
                code += childArr.join(',');
                code += '}';
            }
            else if (innerOption.type === 'dictionaryGet') {
                code = this.createCodeText(innerOption.dictionary) + '.' + innerOption.key;
            }
            else if (innerOption.type === 'var') {
                code = innerOption.name;
            }
            else if (['function', 'relationalModel'].includes(innerOption.type)) {
                code += innerOption.name + '(';
                let TempPropArr = [];
                innerOption.props.forEach((item) => {
                    TempPropArr.push(this.createCodeText(item));
                });
                code += TempPropArr.join(',');
                code += ')';
            }
            return code;
        },
        addProp(dataType) {
            let dataTypeNew = dataType.split(',')[0];
            if (dataTypeNew === 'number') {
                this.innerOption.props.push(1);
            } else if (dataTypeNew === 'string') {
                this.innerOption.props.push('');
            } else if (dataTypeNew === 'bool') {
                this.innerOption.props.push(true);
            } else if (dataTypeNew === 'array') {
                this.innerOption.props.push([]);
            } else {
                this.innerOption.props.push('');
            }
            this.emitChange();
        },
        changeProp() {
            // dataType参数类型，支持函数返回值，这就意味着，当修改某一个类型的时候，可能会影响其他的类型，所以重新计算对应类型的默认值
            for (let i = 0; i < this.allMatch.length; i++) {
                if (this.innerOption.name.match(this.allMatch[i].match)) {
                    this.codeOption = this.allMatch[i];
                    this.codeOption.props.forEach((item, key) => {
                        if (typeof item.dataType === 'function') {
                            // this.innerOption.props并不是原始的Obj格式
                            let dataType = item.dataType(this.innerOption.props);
                            let replace = false;
                            if (['number', 'string', 'boolean'].includes(typeof this.innerOption.props[key])) {
                                if (!dataType.split(',').includes(typeof this.innerOption.props[key])) {
                                    replace = true;
                                }
                            } else if (this.innerOption.props[key] instanceof Array) {
                                if (!dataType.split(',').includes('bool')) {
                                    replace = true;
                                }
                            }
                            if (replace) {
                                if (dataType.split(',').includes('number')) {
                                    this.innerOption.props[key] = 1;
                                } else if (dataType.split(',').includes('string')) {
                                    this.innerOption.props[key] = '';
                                } else if (dataType.split(',').includes('bool')) {
                                    this.innerOption.props[key] = true;
                                } else if (dataType.split(',').includes('array')) {
                                    this.innerOption.props[key] = [];
                                }
                            }
                        }
                    });
                    this.emitChange();
                }
            }
        },
        changeType(name) {
            // codeOption.props
            if (name === 'var') {
                this.innerOption = 1;
                // 需要增加保证i不等于自己的逻辑
                for (let i in this.allVar) {
                    this.innerOption = {
                        type: 'var',
                        name: i
                    };
                    break;
                }
            } else if (['TRUE', 'FALSE'].includes(name)) {
                this.innerOption = name === 'TRUE';
            } else if (['number', 'string', 'dict', 'array'].includes(name)) {
                this.innerOption = this.getDefaultValueByType(name);
            } else {
                this.innerOption = {
                    name: name,
                    props: []
                };
                for (let i = 0; i < this.allMatch.length; i++) {
                    if (this.innerOption.name.match(this.allMatch[i].match)) {
                        this.codeOption = this.allMatch[i];
                        this.innerOption.type = this.codeOption.type;
                        this.allMatch[i].props.forEach((item) => {
                            let dataType = item.dataType;
                            if (dataType instanceof Array) {
                                dataType = dataType[0];
                            }
                            let firstType = dataType.split(',')[0];
                            if (firstType.match(/array\((.*)\)/)) {
                                firstType = 'array';
                            }
                            if (item.enum) {
                                for (let j in item.enum) {
                                    this.innerOption.props.push(j);
                                    break;
                                }
                            } else if (typeof dataType === 'function') {
                                this.innerOption.props.push(dataType);
                            } else {
                                this.innerOption.props.push(this.getDefaultValueByType(firstType));
                            }
                        });
                    }
                }
                for (let i = 0; i < this.innerOption.props.length; i++) {
                    if (typeof this.innerOption.props[i] === 'function') {
                        this.innerOption.props[i] = this.innerOption.props[i](this.innerOption.props);
                        let first = this.innerOption.props[i].split(',')[0];
                        if (first.match(/array\((.*)\)/)) {
                            first = 'array';
                        }
                        this.innerOption.props[i] = this.getDefaultValueByType(first);
                    }
                }
            }
            this.emitChange();
        },
        changeVar(val) {
            let map = this.allVar[val].value;
            if (!(map instanceof Array) && map instanceof Object) {
                let item = {
                    type: 'dictionaryGet',
                    dictionary: this.getOptionByObj(this.allVar[val]),
                    keys: map
                };
                for (let i in map) {
                    item.key = i;
                    break;
                }
                this.setInnerOption(item);
            } else {
                this.setInnerOption({
                    type: 'var',
                    name: val
                });
            }
        },
        changeDictObj() {
            // ??目前只处理了dict是变量的情况，现实有更复杂的嵌套的情况
            if (this.innerOption.dictionary.type === 'var') {
                let map = this.allVar[this.innerOption.dictionary.name].value;
                if (map instanceof Array) {

                } else if (map instanceof Object) {
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
        }
    }
}
</script>
<style scoped lang="less">
    @borderColor: rgb(166, 166, 166);
    select {
        border: solid 1px @borderColor;
    }

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
            .y-item {
                display: flex;
                position: relative;
                padding-right: 15px;
                .likeText {
                    border: none;
                }
                &:hover {
                    .likeText {
                        border: solid 1px @borderColor;
                    }
                    .closeButton {
                        display: inherit;
                    }
                }
                .closeButton {
                    position: absolute;
                    display: none;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: 14px;
                    border-radius: 5px;
                    text-align: center;
                    cursor: pointer;
                    &:hover {
                        border: solid 1px black;
                        background-color: #e77f7e;
                        color: white;
                    }
                }
            }
        }
    }
</style>