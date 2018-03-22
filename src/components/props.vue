<template>
    <div class="prop">
        <table>
            <tbody>
            <template v-if="typeof innerOption==='number'||typeof innerOption==='string'">
                <tr>
                    <td>
                        <select :value="typeof innerOption" @change="changeType($event.target.value)">
                            <option value="string">字符串</option>
                            <option value="var">变量</option>
                            <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}</option>
                        </select>
                    </td>
                    <td>
                        <input :value="innerOption" v-if="typeof innerOption==='number'"
                               @change="inputChange(parseFloat($event.target.value))"/>
                        <input :value="innerOption" v-else @change="inputChange($event.target.value.toString())"/>
                    </td>
                </tr>
            </template>
            <template v-else-if="typeof innerOption==='boolean'">
                <tr>
                    <td>
                        <select :value="innerOption===true?'TRUE':'FALSE'" @change="changeType($event.target.value)">
                            <option value="string">字符串</option>
                            <option value="var">变量</option>
                            <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}</option>
                        </select>
                    </td>
                </tr>
            </template>
            <template v-else-if="innerOption.type === 'var'">
                <tr>
                    <td>
                        <select :value="innerOption.type" @change="changeType($event.target.value)">
                            <option value="string">字符串</option>
                            <option value="var">变量</option>
                            <option v-for="item in allMatch" v-if="item.name" :value="item.name">{{item.title}}</option>
                        </select>
                    </td>
                    <td>
                        <select :value="innerOption.name" @change="inputChange({type:'var',name:$event.target.value})">
                            <option v-for="item,key in allVar" :value="key">【{{key}}】---{{item.value}}</option>
                        </select>
                    </td>
                </tr>
            </template>
            <template v-else-if="innerOption.type === 'function'">
                <tr>
                    <td>函数{{innerOption.name}}</td>
                    <td>
                        <select :value="innerOption.name" @change="changeType($event.target.value)">
                            <option value="string">字符串</option>
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
                        <template v-else-if="value instanceof Object">
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
                                添加
                            </template>
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
            </tbody>
        </table>
    </div>
</template>
<script>
import innerDom from './props.vue';
import allMatch from '../allMatch';
import allVar from '../allVar';
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
            var code = this.createCodeText(this.innerOption);
            this.$emit('change', code);
        },
        inputChange(val) {
            if (val !== undefined) {
                this.innerOption = val;
            }
            this.$emit('input', this.innerOption);
            var code = this.createCodeText(this.innerOption);
            this.$emit('change', code);
        },
        createCodeText(innerOption) {
            var code = '';
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
                code = innerOption;
            } else if (typeof innerOption === 'boolean') {
                code = innerOption ? 'TRUE' : 'FALSE';
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
            var code = this.createCodeText(this.innerOption);
            this.$emit('change', code);
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