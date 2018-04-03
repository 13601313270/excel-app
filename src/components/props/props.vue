<template>
    <div class="prop">
        <table>
            <tbody>
            <template v-if="dataType==='relationalModel'">
                <tr>
                    <td>关系模型</td>
                    <td></td>
                </tr>
                <tr v-for="(value,key) in codeOption.props">
                    <td v-html="codeOption.props[key].title"></td>
                    <td>
                        <inner-dom v-if="innerOption.props[key]"
                                   @change="emitChange"
                                   v-model="innerOption.props[key]"
                                   :dataType="getDataType(key)"
                        ></inner-dom>
                    </td>
                    <!--<td v-html="JSON.stringify(codeOption.props[key])"></td>-->
                </tr>
            </template>
            <template v-else-if="innerOption.type === 'function'">
                <tr>
                    <td>函数{{innerOption.name}}</td>
                    <td>
                        <select-type
                            :value="innerOption.name"
                            @change="changeType"
                            :dataType="dataType"
                        ></select-type>
                    </td>
                </tr>
                <tr v-for="(value,key) in innerOption.props">
                    <td v-html="key>=codeOption.props.length?codeOption.props[codeOption.props.length-1].title:codeOption.props[key].title"></td>
                    <td>
                        <template
                            v-if="key>=codeOption.props.length-1 && getDataType(codeOption.props.length-1) instanceof Array">
                            <select v-if="codeOption.props[codeOption.props.length-1].enum">
                                <option v-for="title,val in codeOption.props[codeOption.props.length-1].enum"
                                        :value="val">{{title}}
                                </option>
                            </select>


                            <div v-if="getDataType(codeOption.props.length-1)[0]==='relationalModel'">
                                <select :value="innerOption.props[key].name"
                                        @change="setInnerOption({type:'var',name:$event.target.value})">
                                    <option v-for="(item,key) in allVar" :value="key"
                                            v-if="item.value_ instanceof relationalModel">
                                        {{key}}
                                    </option>
                                </select>
                                <br/>
                                <button>新建</button>
                            </div>
                            <inner-dom v-else @change="emitChange" v-model="innerOption.props[key]"
                                       :dataType="getDataType(codeOption.props.length-1)[0]"></inner-dom>


                            <template v-if="key==innerOption.props.length-1">
                                <button @click="addProp(getDataType(codeOption.props.length-1)[0])">添加</button>
                            </template>
                        </template>
                        <select v-else-if="codeOption.props[key].enum" v-model="innerOption.props[key]"
                                @change="changeProp">
                            <option v-for="title,val in codeOption.props[key].enum" :value="val">{{title}}</option>
                        </select>
                        <template v-else>
                            <div v-if="getDataType(key)==='relationalModel'">
                                <select :value="innerOption.props[key].name"
                                        @change="innerOption.props[key]={type:'var',name:$event.target.value},emitChange()">
                                    <option v-for="(item,key) in allVar" :value="key"
                                            v-if="item.value_ instanceof relationalModel">
                                        {{key}}
                                    </option>
                                </select>
                                <br/>
                                <button>新建</button>
                            </div>
                            <inner-dom v-else @change="emitChange" v-model="innerOption.props[key]"
                                       :dataType="getDataType(key)"></inner-dom>
                        </template>
                    </td>
                    <!--<td v-html="JSON.stringify(codeOption.props[key])"></td>-->
                </tr>
            </template>
            <template v-else>
                <tr>
                    <template v-if="typeof innerOption==='number'||typeof innerOption==='string'">
                        <td>
                            <select-type
                                :value="typeof innerOption"
                                @change="changeType"
                                :dataType="dataType"
                            ></select-type>
                        </td>
                        <td>
                            <input :value="innerOption" v-if="typeof innerOption==='number'"
                                   @change="setInnerOption(parseFloat($event.target.value))"/>
                            <input :value="innerOption" v-else
                                   @change="setInnerOption($event.target.value.toString())"/>
                        </td>
                    </template>
                    <template v-else-if="typeof innerOption==='boolean'">
                        <td>
                            <select-type
                                :value="innerOption===true?'TRUE':'FALSE'"
                                @change="changeType"
                                :dataType="dataType"
                            ></select-type>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type === 'var'">
                        <td>
                            <select-type
                                :value="innerOption.type"
                                @change="changeType"
                                :dataType="dataType"
                            ></select-type>
                        </td>
                        <td>
                            <select :value="innerOption.name"
                                    @change="setInnerOption({type:'var',name:$event.target.value})">
                                <option v-for="item,key in allVar" :value="key">
                                    【{{key}}】{{typeof item.value == 'object' ? '' : ('---' + item.value)}}
                                </option>
                            </select>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='array'">
                        <td>数组</td>
                        <td>
                            <template v-for="(item,key) in innerOption.props">
                                <inner-dom v-model="innerOption.props[key]" @change="emitChange"
                                           :dataType="dataType.match(/array\((.*)\)/)[1]"></inner-dom>
                                <template v-if="key==innerOption.props.length-1">
                                    <button @click="addProp(dataType.match(/array\((.*)\)/)[1])">添加</button>
                                </template>
                            </template>
                            <template v-if="innerOption.props.length==0">
                                <button @click="addProp(dataType.match(/array\((.*)\)/)[1])">添加</button>
                            </template>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='dict'">
                        <td>字典</td>
                        <td>
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
                                            @click="innerOption.props[prompt('请输入键名', 'a7')]='val',emitChange()">
                                            添加
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='dictionaryGet'">
                        <td>字典获取</td>
                        <td>
                            <inner-dom @change="changeDictObj"
                                       v-model="innerOption.dictionary"
                                       :dataType="''"
                            ></inner-dom>

                            <select @change="emitChange()" v-model="innerOption.key">
                                <option v-for="item,key in innerOption.keys" :value="key">
                                    【{{key}}】------{{item}}
                                </option>
                            </select>
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
import relationalModel from '../../widget/relationalModel';
import __array__ from '../../languageParser/array';
import __dictionary__ from '../../languageParser/dictionary';
import dictionaryGet from '../../languageParser/dictionaryGet';
import Var from '../../observer/Var';
import selectType from './typeSelect.vue';
export default {
    name: 'inner-dom',
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
            // if (this.isRoot) {
            //    this.innerOption = this.getOptionByObj(val);
            // } else {
            this.innerOption = val;
            // }
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
                console.log(returnOption);
            }
            else if (obj instanceof Var) {
                returnOption = {
                    type: 'var',
                    name: obj.name
                };
            }
            else {
                returnOption = {
                    type: obj.type,
                    name: obj.name,
                    props: []
                };
                console.trace(obj);
                console.log(obj.props);
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
            else if (innerOption.type === 'function') {
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
        changeDictObj() {
            // ??目前只处理了dict是变量的情况，现实有更复杂的嵌套的情况
            if (this.innerOption.dictionary.type === 'var') {
                let map = this.allVar[this.innerOption.dictionary.name].value;
                this.innerOption.keys = map;
                for (let i in map) {
                    this.innerOption.key = i;
                    break;
                }
            }
            this.emitChange();
        },
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
    }
</style>