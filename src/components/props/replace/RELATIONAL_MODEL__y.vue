<template>
    <div>
        <div>字段有：
            <span v-for="(item,key) in columnObj" v-html="key+';'"></span>
        </div>
        <div>
            <div v-for="(item,key) in data.props" style="display: flex">
                <div v-if="data.props[key] && data.props[key].type===keyType">
                    <select v-model="data.props[key].groupType" @change="change">
                        <option value="count">count</option>
                        <option value="sum">sum</option>
                    </select>
                    <select
                        @change="change"
                        v-model="data.props[key].column"
                    >
                        <option v-for="(item,key) in columnObj" :value="key">
                            {{item.title}}
                        </option>
                    </select>
                </div>
                <inner-dom
                    v-else
                    v-model="data.props[key]"
                    @change="change"
                    :dataType="'string'"
                ></inner-dom>
                <div @click="data.props.splice(key,1),change()">X</div>
            </div>
            <appButton size="mini" @click="addEmpty">添加</appButton>
        </div>
    </div>
</template>
<script>
import ajax from '../../../api/ajax';
import innerDom from '../props_bak.vue';
import appButton from '../../ui/button.vue';
import cloneUtils from '../../clone.utils';
export default {
    name: 'relationModelY',
    props: {
        sourceId: [Number, String],
        table: String,
        value: Object,
        dataType: String
    },
    mounted() {
        this.init();
        this.data = this.initData(this.value);
    },
    data() {
        return {
            columnObj: [],
            data: {},
            keyType: 'hubhjjknhnniu'
        };
    },
    methods: {
        init() {
            if(this.table && this.sourceId) {
                ajax({
                    type: 'POST',
                    url: 'http://www.tablehub.cn/action/mysql.html',
                    data: {
                        type: 'showCreateTable',
                        connection: this.sourceId,
                        table: this.table
                    }
                }).then((data) => {
                    this.columnObj = data;
                });
            } else {
                this.columnObj = [];
            }
        },
        // 将传入的配置中字符串分解，例如count(id)，转换成count和id两个信息
        initData(data) {
            data.props = data.props.map(item => {
                if(typeof item === 'string') {
                    let temp = item.match(/(\S+)\((\S+)\)/);
                    if(temp) {
                        return {
                            type: this.keyType,
                            groupType: temp[1],
                            column: temp[2]
                        };
                    }
                } else {
                    return item;
                }
            });
            return data
        },
        addEmpty() {
            let allKeys = Object.keys(this.columnObj);
            this.data.props.push({
                type: this.keyType,
                groupType: 'count',
                column: allKeys[0]
            });
            this.change();
        },
        change() {
            let returnObj = cloneUtils.deep(this.data);
            returnObj.props = returnObj.props.map(item => {
                if(item.type === this.keyType) {
                    return item.groupType + '(' + item.column + ')';
                } else {
                    return item;
                }
            });
            console.log(returnObj);
            this.$emit('input', returnObj);
            this.$emit('change');
        },
        clear() {
            this.$emit('input', '');
            this.$emit('change');
        }
    },
    watch: {
        sourceId() {
            this.init();
        },
        table() {
            this.init();
        },
        value(val) {
            this.data = this.initData(this.value);
        }
    },
    components: {
        innerDom, appButton
    }
}
</script>
<style scoped lang="less">

</style>