<template>
    <div>
        <div>页面组件</div>
        <table style="width: 100%;">
            <thead>
            <tr>
                <td>对象</td>
                <td>公式</td>
                <td>计算值</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,key) in datas">
                <td v-html="key"></td>
                <td v-html="item.code"></td>
                <td v-html="item.value"></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import Obj from '../obj';
import AllVarClass from '../allVar.js';

class TempClass extends Obj {
}
export default {
    props: ['data', 'randomId'],
    data() {
        return {
            datas: {}
        };
    },
    mounted() {
        let self = this;
        let list = new TempClass();
        list.render = function() {
            for (let i in AllVarClass.value) {
                // console.log(AllVarClass.value[i].codeText);
                self.$set(self.datas, i, {
                    code: AllVarClass.value[i].codeText,
                    value: AllVarClass.value[i].value
                });
            }
        };
        AllVarClass.notify(list);
    },
    methods: {}
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