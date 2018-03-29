<template>
    <div class="prop">
        <table>
            <tbody>
            <template v-if="innerOption.type === 'function'">
                <tr>
                    <td>函数{{innerOption.name}}</td>
                    <td>
                        <select :value="innerOption.name" @change="changeType($event.target.value)">
                            <option value="var" v-if="(dataType===''||dataType.split(',').includes('var'))">变量</option>
                            <option v-for="item in allMatch"
                                    v-if="item.name && (dataType===''||dataType.split(',').includes(item.type))"
                                    :value="item.name">{{item.title}}
                            </option>
                        </select>
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
                            <inner-dom @change="childCodeChange" v-model="innerOption.props[key]"
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
                            <inner-dom @change="childCodeChange" v-model="innerOption.props[key]"
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
                            <select :value="typeof innerOption" @change="changeType($event.target.value)">
                                <option value="var" v-if="(dataType===''||dataType.split(',').includes('var'))">变量
                                </option>
                                <option v-for="item in allMatch"
                                        v-if="item.name && (dataType===''||dataType.split(',').includes(item.type))"
                                        :value="item.name">
                                    {{item.title}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <input :value="innerOption" v-if="typeof innerOption==='number'"
                                   @change="inputChange(parseFloat($event.target.value))"/>
                            <input :value="innerOption" v-else @change="inputChange($event.target.value.toString())"/>
                        </td>
                    </template>
                    <template v-else-if="typeof innerOption==='boolean'">
                        <td>
                            <select :value="innerOption===true?'TRUE':'FALSE'"
                                    @change="changeType($event.target.value)">
                                <option value="var" v-if="(dataType===''||dataType.split(',').includes('var'))">变量
                                </option>
                                <option v-for="item in allMatch"
                                        v-if="item.name && (dataType===''||dataType.split(',').includes(item.type))"
                                        :value="item.name">
                                    {{item.title}}
                                </option>
                            </select>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type === 'var'">
                        <td>
                            <select :value="innerOption.type" @change="changeType($event.target.value)">
                                <option value="var" v-if="(dataType===''||dataType.split(',').includes('var'))">变量
                                </option>
                                <option v-for="item in allMatch"
                                        v-if="item.name && (dataType===''||dataType.split(',').includes(item.type))"
                                        :value="item.name">
                                    {{item.title}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <select :value="innerOption.name"
                                    @change="inputChange({type:'var',name:$event.target.value})">
                                <option v-for="item,key in allVar" :value="key">【{{key}}】---{{item.value}}</option>
                            </select>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type==='array'">
                        <td>
                            <select :value="innerOption.type" @change="changeType($event.target.value)">
                                <option value="var">变量</option>
                                <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <template v-for="(item,key) in innerOption.props">
                                <inner-dom v-model="innerOption.props[key]" @change="childCodeChange"
                                           dataType=""></inner-dom>
                                <template v-if="key==innerOption.props.length-1">
                                    <button @click="addProp('string')">添加</button>
                                </template>
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
import allMatch from '../languageParser/allMatch';
import allVar from '../observer/allVar';
// import getStrByObj from '../getStrByObj';
import __array__ from '../languageParser/array';
export default {
    name: 'inner-dom',
    props: {
        value: {},
        dataType: ''
    },
    components: {
        'inner-dom': innerDom
    },
    computed: {},
    watch: {
        value(val) {
            if (val instanceof Object) {
                this.innerOption = {
                    type: val.type,
                    name: val.name.toString(),
                    props: val.props
                };

                for (let i = 0; i < this.allMatch.length; i++) {
                    if (this.innerOption.name.match(this.allMatch[i].match)) {
                        this.codeOption = this.allMatch[i];
                        this.innerOption.type = this.codeOption.type;
                        break;
                    }
                }
            } else if (val instanceof __array__) {
                this.innerOption = {
                    type: 'array',
                    props: val.value_
                };
            } else {
                this.innerOption = val;
            }
        }
    },
    data() {
        return {
            name: '',
            innerOption: {},
            codeOption: {},
            allMatch: {},
            allVar: allVar.getAllData()
        };
    },
    mounted() {
        if (['boolean', 'number', 'string'].includes(typeof this.value)) {
            this.innerOption = this.value;
        } else if (this.value instanceof __array__) {
            this.innerOption = {
                type: 'array',
                props: this.value.value_
            };
        } else {
            this.innerOption = {
                type: this.value.type,
                name: this.value.name,
                props: this.value.props
            };
        }
        this.allMatch = allMatch;
        if (this.innerOption.name) {
            for (let i = 0; i < this.allMatch.length; i++) {
                if (this.innerOption.name.match(this.allMatch[i].match)) {
                    this.codeOption = this.allMatch[i];
                    this.innerOption.type = this.codeOption.type;
                }
            }
        }
    },
    methods: {
        getDataType(key) {
            if (typeof this.codeOption.props[key].dataType === 'function') {
                return this.codeOption.props[key].dataType(this.innerOption.props);
            } else {
                return this.codeOption.props[key].dataType;
            }
        },
        childCodeChange() {
            this.$emit('input', this.innerOption);
            this.$emit('change', this.createCodeText(this.innerOption));
        },
        inputChange(val) {
            if (val !== undefined) {
                this.innerOption = val;
            }
            this.$emit('input', this.innerOption);
            this.$emit('change', this.createCodeText(this.innerOption));
        },
        createCodeText(innerOption) {
            let code = '';
            if (innerOption.type === 'function') {
                code += innerOption.name + '(';
                let TempPropArr = [];
                innerOption.props.forEach((item) => {
                    TempPropArr.push(this.createCodeText(item));
                });
                code += TempPropArr.join(',');
                code += ')';
            } else if (innerOption.type === 'var') {
                code = innerOption.name;
            } else if (typeof innerOption === 'string') {
                code = '"' + innerOption + '"';
            } else if (typeof innerOption === 'number') {
                code = innerOption.toString();
            } else if (typeof innerOption === 'boolean') {
                code = innerOption ? 'TRUE' : 'FALSE';
            } else if (innerOption.type === 'array') {
                code = '[';
                let childArr = [];
                innerOption.props.forEach((item) => {
                    childArr.push(this.createCodeText(item));
                });
                code += childArr.join(',');
                code += ']';
            } else if (innerOption instanceof __array__) {
                code = '[';
                let childArr = [];
                innerOption.value_.forEach((item) => {
                    childArr.push(this.createCodeText(item));
                });
                code += childArr.join(',');
                code += ']';
            }
            return code;
        },
        addProp(dataType) {
            let dataTypeNew = dataType.split(',')[0];
            console.log(dataTypeNew);
            if (dataTypeNew === 'number') {
                this.innerOption.props.push(1);
            } else if (dataTypeNew === 'string') {
                this.innerOption.props.push('');
            } else if (dataTypeNew === 'bool') {
                this.innerOption.props.push(true);
            } else if (dataTypeNew === 'array') {
                this.innerOption.props.push([]);
            } else {
                this.innerOption.props.push([]);
            }
            this.childCodeChange();
        },
        changeProp() {
            for (let i = 0; i < this.allMatch.length; i++) {
                if (this.innerOption.name.match(this.allMatch[i].match)) {
                    this.codeOption = this.allMatch[i];
                    this.codeOption.props.forEach((item, key) => {
                        if (typeof item.dataType === 'function') {
                            let dataType = item.dataType(this.innerOption.props);
                            let replace = false;
                            if (typeof this.innerOption.props[key] === 'number') {
                                if (!dataType.split(',').includes('number')) {
                                    replace = true;
                                }
                            } else if (typeof this.innerOption.props[key] === 'string') {
                                if (!dataType.split(',').includes('string')) {
                                    replace = true;
                                }
                            } else if (typeof this.innerOption.props[key] === 'boolean') {
                                if (!dataType.split(',').includes('bool')) {
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
                        } else {
                            console.log(item.dataType);
                        }
                    });
                    this.$emit('input', this.innerOption);
                    this.$emit('change', this.createCodeText(this.innerOption));
                }
            }
        },
        changeType(name) {
            console.log(name);
            // codeOption.props
            if (name === 'var') {
                this.innerOption = 1;
                for (let i in this.allVar) {
                    this.innerOption = {
                        type: 'var',
                        name: i
                    };
                    break;
                }
            } else if (name === 'number') {
                this.innerOption = 0;
            } else if (name === 'string') {
                this.innerOption = '';
            } else if (['TRUE', 'FALSE'].includes(name)) {
                this.innerOption = name === 'TRUE';
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
                            console.log('-------');
                            console.log(dataType);
                            if (item.enum) {
                                for (let j in item.enum) {
                                    this.innerOption.props.push(j);
                                    break;
                                }
                            } else if (typeof dataType === 'function') {
                                this.innerOption.props.push(dataType);
                            } else if (dataType.split(',').includes('number')) {
                                this.innerOption.props.push(1);
                            } else if (dataType.split(',').includes('string')) {
                                this.innerOption.props.push('');
                            } else if (dataType.split(',').includes('bool')) {
                                this.innerOption.props.push(true);
                            } else if (dataType.split(',').includes('array')) {
                                this.innerOption.props.push([]);
                            }
                        });
                    }
                }
                for (let i = 0; i < this.innerOption.props.length; i++) {
                    if (typeof this.innerOption.props[i] === 'function') {
                        this.innerOption.props[i] = this.innerOption.props[i](this.innerOption.props);
                        if (this.innerOption.props[i].split(',').includes('number')) {
                            this.innerOption.props[i] = 1;
                        } else if (this.innerOption.props[i].split(',').includes('string')) {
                            this.innerOption.props[i] = '';
                        } else if (this.innerOption.props[i].split(',').includes('bool')) {
                            this.innerOption.props[i] = true;
                        } else if (this.innerOption.props[i].split(',').includes('array')) {
                            this.innerOption.props[i] = [];
                        }
                    }
                }
            }
            this.$emit('input', this.innerOption);
            this.$emit('change', this.createCodeText(this.innerOption));
        }
    }
}
</script>
<style scoped lang="less">
    table {
        border-collapse: collapse;
        td {
            border: solid 1px black;
        }
    }
</style>