<template>
    <div>
        <div>页面组件</div>
        <table style="width: 100%;">
            <thead>
            <tr>
                <td>对象</td>
                <td>公式</td>
                <td>计算值</td>
                <td>操作</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,key) in datas">
                <td v-html="key"></td>
                <td v-html="getCodeByVal(item)"></td>
                <td v-if="['string','number'].includes(typeof item)" v-html="item"></td>
                <td v-else v-html="item.value"></td>
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
import getStrByObj from '../getStrByObj';
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
            console.log(val.value_);
            self.$set(self.datas, key, val.value_);
        });
    },
    methods: {
        getCodeByVal(val) {
            return getStrByObj(val);
        },
        change(key) {
            this.$emit('change', key);
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
            border: solid 1px black;
        }

    }
</style>