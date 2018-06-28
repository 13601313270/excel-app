<template>
    <div>
        <h2>数据链接</h2>
        <div v-for="item in connections">
            <div v-html="item.name"></div>
            <div style="display: none">
                <div v-html="item.id"></div>
                <div v-html="item.uid"></div>
                <div v-html="item.type"></div>
                <div v-html="item.info.db"></div>
                <div v-html="item.info.host"></div>
                <div v-html="item.info.port"></div>
                <div v-html="item.info.username"></div>
            </div>
        </div>
        <h2>数据表</h2>
        <div>
            <div v-for="(item,key) in datas" v-if="item.type==='relationalModel'">
                <div><span v-html="key"></span>
                    <button @click="change(key)">修改</button>
                </div>
                <div>链接：{{getCodeByVal(item.props[0])}}</div>
                <div>表：{{getCodeByVal(item.props[1])}}</div>
                <div>分类X：{{getCodeByVal(item.props[2])}}</div>
                <div>数据Y：{{getCodeByVal(item.props[3])}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import AllVarClass from '../../observer/allVar.js';
import getStrByObj from '../../languageParser/getStrByObj';

export default {
    props: ['connections'],
    data() {
        return {
            datas: {}
        };
    },
    mounted() {
        let self = this;
        AllVarClass.on('valChange', function(key, val) {
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
</style>