<template>
    <div>
        <table style="width: 100%;">
            <thead>
            <tr>
                <td style="min-width: 60px;">对象</td>
                <td style="min-width: 180px;">公式</td>
                <td>计算值</td>
                <td style="width: 130px">操作</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,key) in datas"
                v-if="item!==undefined && item.type!=='relationalModel'"
                @mouseover="hover(key)"
                @mouseout="leave(key)">
                <td v-html="key"></td>
                <td v-html="getCodeByVal(item)"></td>
                <td>
                    <div class="run_result" v-if="['string','number','boolean'].includes(typeof item)"
                         v-html="item"></div>
                    <div class="run_result" v-else-if="item.value===undefined||item.value===null"></div>
                    <div class="run_result" v-else-if="item.value instanceof Array">数组</div>
                    <div class="run_result" v-else-if="item.value instanceof Object">对象:<br/>{{item.value}}</div>
                    <div class="run_result" v-else v-html="item.value.toString()"></div>
                </td>
                <td class="tool">
                    <ui-button size="mini" @click="change(key)">修改</ui-button>
                    <ui-button size="mini" v-if="varUseState(key)===false" @click="deleteItem(key)">删除</ui-button>
                    <span v-else v-html="varUseState(key)"></span>
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
import Obj from '../observer/obj';
export default {
    props: {
        useCreateVar: {
            type: Array
        },
        varToWidget: {
            type: Array
        }
    },
    data() {
        return {
            datas: {}
        };
    },
    computed: {
        ...mapGetters('main', ['varHighlight'])
    },
    mounted() {
        let self = this;
        AllVarClass.on('valChange', function(key, val) {
            if(val.value_ !== undefined) {
                let matchItem = allMatch.find(item => {
                    if (val.value_ instanceof Obj) {
                        return item.match.test(val.value_.name);
                    } else {
                        // let type = item.type;
                        return typeof val.value_ === item.type;
                    }
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
        hover(key) {
            this.$emit('hover', key, 'info');
        },
        varUseState(key) {
            // item.dep.sentEvent 指向 变量对应的计算公式的Dep
            // 所有VarSentDep需要通知的对象
            if (this.varToWidget.includes(key)) {
                return '已渲染';
            }
            if (!this.useCreateVar.includes(key)) {
                return '系统变量';
            }
            let hasUsed = AllVarClass.getVar(key).dep.sentEvent.findIndex(item => {
                return !(item instanceof AllVarClass.constructor);
            }) > -1;
            return hasUsed ? '被使用' : false;
        },
        deleteItem(key) {
            AllVarClass.deleteVar(key);
            this.$delete(this.datas, key);
            this.$emit('delete', key);
        },
        leave(key) {
            this.$emit('hover', key, 'none');
        },
        getHighlightState(varName) {
            if (this.varHighlight.key === varName) {
                return this.varHighlight.info;
            }
            return 'none';
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
            &.tool {
                > * {
                    float: left;
                    margin-left: 3px;
                }
            }
            .run_result {
                max-height: 100px;
                overflow: auto;
            }
        }

    }
</style>
