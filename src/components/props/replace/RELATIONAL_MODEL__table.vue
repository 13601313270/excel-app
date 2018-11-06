<template>
    <div style="display: flex">
        <select
            v-if="typeof data === 'string'"
            @change="change"
            v-model="data"
        >
            <option v-for="item in tableList" :value="item.name">
                {{item.name}}
            </option>
        </select>
        <slot v-else name="default"></slot>
    </div>
</template>
<script>
import ajax from '../../../api/ajax';
export default {
    props: {
        sourceId: [Number, String],
        value: [String, Object]
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            tableList: [],
            data: this.value
        };
    },
    methods: {
        init() {
            ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/action/mysql.html',
                data: {
                    type: 'showTables',
                    connection: this.sourceId
                }
            }).then((data) => {
                this.tableList = data;
            });
        },
        change() {
            this.$emit('input', this.data);
            this.$emit('change');
        }
    },
    watch: {
        sourceId() {
            this.init();
        },
        value(val) {
            this.data = val;
        }
    }
}
</script>
<style scoped lang="less">

</style>