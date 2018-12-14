<template>
    <div>
        <div>
            <ui-button @click="addData" size="mini">添加数据</ui-button>
            <table style="width: 100%;">
                <thead>
                <tr>
                    <td style="min-width: 50px;">对象</td>
                    <td>公式</td>
                    <td>计算值</td>
                    <td style="min-width: 36px;">操作</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,key) in datas">
                    <td v-html="key"></td>
                    <td v-html="getCodeByVal(item)"></td>
                    <td style="min-width: 150px;">
                        <div>链接：{{getConnection(item.props[0])}}</div>
                        <div>表：{{getCodeByVal(item.props[1])}}</div>
                        <div>分类X：{{getCodeByVal(item.props[2])}}</div>
                        <div>数据Y：{{getCodeByVal(item.props[3])}}</div>
                        <button @click="showData(key)">查看数据</button>
                    </td>
                    <td>
                        <button @click="change(key)">修改</button>
                        <button v-if="isCanDelete(key,item)===true" @click="deleteItem(key)">删除</button>
                        <span v-else v-html="isCanDelete(key,item)"></span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <popup v-if="showDataKey" class="www" @close="showDataKey=''">
            <div style="max-height:400px;overflow: scroll">
                <table style="width: 100%;color:black">
                    <thead>
                    <tr>
                        <td v-for="group in datas[showDataKey].value.groupColumn" v-html="group"></td>
                        <td v-for="column in datas[showDataKey].value.dataColumn" v-html="column"></td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="dataItem in datas[showDataKey].value.dataValue">
                        <td v-for="data in dataItem" v-html="data"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </popup>
    </div>
</template>
<script>
import AllVarClass from '../../observer/allVar.js';
import getStrByObj from '../../languageParser/getStrByObj';
import ptWindow from '../ui/window.vue';
// import getEvalObj from '../../languageParser/evalObjAndStr';
import popup from '../ui/popup.vue';
import { mapActions } from 'vuex';
import widgetEvent from '../widgetChange';
import { prompt } from '../alert/prompt';
import allMatch from '../../languageParser/allMatch';
export default {
    props: {
        connections: {},
        useCreateVar: {
            type: Array
        }
    },
    data() {
        return {
            datas: {},
            showDataKey: '',
            isShowData: {}
        };
    },
    mounted() {
        let self = this;
        AllVarClass.on('valChange', function(key, val) {
            if(val.value_ !== undefined) {
                let matchItem = allMatch.find(item => {
                    return item.match.test(val.value_.name);
                });
                if(matchItem) {
                    if(matchItem.returnType === 'relationalModel') {
                        self.$set(self.datas, key, val.value_);
                    }
                }
            }
        });
    },
    methods: {
        ...mapActions('main', ['setDragDomFunc']),
        isCanDelete(key, item) {
            // item.dep.sentEvent 指向 变量对应的计算公式的Dep
            // 所有VarSentDep需要通知的对象
            if(!this.useCreateVar.includes(key)) {
                return '系统变量';
            }

            if(item && item.dep.sentEvent.length > 0) {
                let VarSentDep = item.dep.sentEvent[0].sentEvent.filter(item => {
                    return !(item instanceof AllVarClass.constructor);
                });
                return VarSentDep.length === 0;
            } else {
                return '被使用';
            }
        },
        getConnection(val) {
            let runValue = getStrByObj(val);
            let matchObj = this.connections.find(item => {
                return parseInt(item.id) === runValue;
            });
            if(matchObj) {
                return matchObj.name;
            } else {
                return runValue;
            }
        },
        getCodeByVal(val) {
            return getStrByObj(val);
        },
        change(key) {
            this.$emit('change', key);
        },
        deleteItem(key) {
            AllVarClass.deleteVar(key);
            this.$delete(this.datas, key);
            this.$emit('delete', key);
        },
        addData() {
            prompt('请输入数据变量名称', 'data1').then((varName) => {
                if(varName !== null) {
                    this.setDragDomFunc('RELATIONAL_MODEL');
                    // this.setDragDomFunc('MIN');
                    varName = '$' + varName.replace(/^\$/, '');
                    widgetEvent.emit('change', varName);
                }
            });
        },
        showData(key) {
            this.showDataKey = key;
            this.$set(this.isShowData, key, !this.isShowData[key]);
        }
    },
    components: {
        ptWindow, popup
    }
}
</script>
<style scoped lang="less">
    table {
        border-collapse: collapse;
        td {
            border: solid 1px #b0b0b0;
            word-break: break-all;
            word-wrap: break-word;
        }

    }
</style>