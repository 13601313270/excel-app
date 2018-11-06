<template>
    <div>
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
            <tr v-for="(item,key) in datas"
                v-if="item!==undefined && item.type!=='relationalModel'"
                @mouseover="hover(key,item)"
                @mouseout="leave(key)">
                <td v-html="key"></td>
                <td v-html="getCodeByVal(item)"></td>
                <td v-if="['string','number','boolean'].includes(typeof item)" v-html="item"></td>
                <td v-else-if="item.value===undefined||item.value===null"></td>
                <td v-else-if="item.value instanceof Array">数组</td>
                <td v-else-if="item.value instanceof Object">对象:<br/>{{item.value}}</td>
                <td v-else v-html="item.value.toString()"></td>
                <td>
                    <button @click="change(key)">修改</button>
                    <button v-if="isCanDelete(key,item)===true" @click="deleteItem(key)">删除</button>
                    <span v-else v-html="isCanDelete(key,item)"></span>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import AllVarClass from '../observer/allVar.js';
import getStrByObj from '../languageParser/getStrByObj';
import { mapGetters } from 'vuex';
import allMatch from '../languageParser/allMatch';
export default {
    props: {
        varToDom: {
            type: Object,
            required: true
        },
        useCreateVar: {
            type: Array
        }
    },
    data() {
        return {
            datas: {}
        };
    },
    computed: {
        ...mapGetters('main', ['widgetIdToVar'])
    },
    mounted() {
        let self = this;
        AllVarClass.on('valChange', function(key, val) {
            if(val.value_ !== undefined) {
                let matchItem = allMatch.find(item => {
                    return item.match.test(val.value_.name);
                });
                if(matchItem) {
                    if(matchItem.returnType !== 'relationalModel') {
                        self.$set(self.datas, key, val.value_);
                    }
                }
            }
        });
    },
    methods: {
        getCodeByVal(val) {
            return getStrByObj(val);
        },
        change(key) {
            this.$emit('change', key);
        },
        hover(key, item) {
            this.$emit('hover', key, 'info');
        },
        isCanDelete(key, item) {
            // item.dep.sentEvent 指向 变量对应的计算公式的Dep
            // 所有VarSentDep需要通知的对象
            /*
             console.log('**********');
             console.log(this.useCreateVar, key);
             console.log(this.useCreateVar.has(key));
             */
            if(!this.useCreateVar.includes(key)) {
                return '系统变量';
            }
            // console.log('---重新计算---');
            if(Object.values(this.widgetIdToVar).includes(key)) {
                return '渲染';
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
        deleteItem(key) {
            AllVarClass.deleteVar(key);
            this.$delete(this.datas, key);
            this.$emit('delete', key);
        },
        leave(key) {
            this.$emit('hover', key, 'none');
        }
    }
}
</script>
<style scoped lang="less">
    .widget {
        border: solid 1px black;
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
    }

    table {
        border-collapse: collapse;
        td {
            border: solid 1px #b0b0b0;
            word-break: break-all;
            word-wrap: break-word;
        }

    }
</style>