<template>
    <div>
        <div>字段有：
            <span v-for="(item,key) in columnObj" v-html="key+';'"></span>
        </div>
        <div>
            <div v-for="(item,key) in data.props" style="display: flex">
                <div v-if="data.props[key].type===keyType">

                </div>
                <inner-dom
                    v-model="data.props[key]"
                    @change="change"
                    :dataType="dataType.match(/array\((.*)\)/)[1]"
                ></inner-dom>
                <div @click="data.props.splice(key,1)">X</div>
            </div>
            <appButton size="mini" @click="data.props.push('')">添加</appButton>
        </div>
    </div>
</template>
<script>
import ajax from '../../../api/ajax';
import innerDom from '../props.vue';
import appButton from '../../ui/button.vue';
export default {
    name: 'relationModelY',
    props: {
        sourceId: String,
        table: String,
        value: Object,
        dataType: String
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            columnObj: [],
            data: this.initData(this.value),
            keyType: Symbol('temp type')
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
                if(false && typeof item === 'string') {
                    let temp = item.match(/(\S+)\((\S+)\)/);
                    return {
                        type: this.keyType,
                        groupType: temp[1],
                        column: temp[2]
                    };
                } else {
                    return item;
                }
            });
            return data
        },
        change() {
            this.$emit('input', this.data);
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
            this.data = val;
        }
    },
    components: {
        innerDom, appButton
    }
}
</script>
<style scoped lang="less">

</style>