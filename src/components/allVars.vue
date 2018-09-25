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
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import AllVarClass from '../observer/allVar.js';
import getStrByObj from '../languageParser/getStrByObj';
export default {
    props: ['data', 'randomId'],
    data() {
        return {
            datas: {}
        };
    },
    mounted() {
        let self = this;
        AllVarClass.on('valChange', function(key, val) {
            console.log(key);
            console.log(val);
            self.$set(self.datas, key, val.value_);
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
            console.log('------');
            console.log(item);
            this.$emit('hover', key, 'info');
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