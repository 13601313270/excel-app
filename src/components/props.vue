<template>
    <div class="prop">
        <table>
            <tbody>
            <template v-if="innerOption.type === 'function'">
                <tr>
                    <td>函数{{innerOption.name}}</td>
                    <td>
                        <select :value="innerOption.name" @change="changeType($event.target.value)">
                            <option value="var">变量</option>
                            <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}</option>
                        </select>
                    </td>
                </tr>
                <tr v-for="(value,key) in innerOption.props">
                    <td v-html="key>=codeOption.props.length?codeOption.props[codeOption.props.length-1].title:codeOption.props[key].title"></td>
                    <td>
                        <template v-if="value instanceof Array">
                            <inner-dom v-model="innerOption.props[key]" @change="childCodeChange"></inner-dom>
                        </template>
                        <template
                            v-else-if="key>=codeOption.props.length-1 && codeOption.props[codeOption.props.length-1].dataType instanceof Array">
                            <select v-if="codeOption.props[codeOption.props.length-1].enum">
                                <option v-for="title,val in codeOption.props[codeOption.props.length-1].enum"
                                        :value="val">{{title}}
                                </option>
                            </select>
                            <template
                                v-if="['number','string','bool'].includes(codeOption.props[codeOption.props.length-1].dataType[0])">
                                <inner-dom @change="childCodeChange" v-model="innerOption.props[key]"></inner-dom>
                            </template>
                            <template v-if="key==innerOption.props.length-1">
                                <button @click="innerOption.props.push(''),childCodeChange()">添加</button>
                            </template>
                        </template>
                        <template v-else-if="value instanceof Object">
                            <inner-dom v-model="innerOption.props[key]" @change="childCodeChange"></inner-dom>
                        </template>
                        <select v-else-if="codeOption.props[key].enum" v-model="innerOption.props[key]">
                            <option v-for="title,val in codeOption.props[key].enum" :value="val">{{title}}</option>
                        </select>
                        <template v-else-if="['number','string','bool'].includes(codeOption.props[key].dataType)">
                            <inner-dom @change="childCodeChange" v-model="innerOption.props[key]"></inner-dom>
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
                                <option value="var">变量</option>
                                <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}
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
                                <option value="var">变量</option>
                                <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}
                                </option>
                            </select>
                        </td>
                    </template>
                    <template v-else-if="innerOption.type === 'var'">
                        <td>
                            <select :value="innerOption.type" @change="changeType($event.target.value)">
                                <option value="var">变量</option>
                                <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}
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
                                <inner-dom v-model="innerOption.props[key]" @change="childCodeChange"></inner-dom>
                                <template v-if="key==innerOption.props.length-1">
                                    <button @click="innerOption.props.push(''),childCodeChange()">添加</button>
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
        value: {}
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
        childCodeChange(childCode) {
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
        changeType(name) {
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
                            if (item.enum) {
                                for (let j in item.enum) {
                                    this.innerOption.props.push(j);
                                    break;
                                }
                            } else if (item.dataType === 'number') {
                                this.innerOption.props.push(1);
                            } else {
                                this.innerOption.props.push('');
                            }
                        });
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