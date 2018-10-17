<template>
    <div style="display: flex">
        <select
            @change="change"
            v-if="data===''"
            v-model="data"
        >
            <option v-for="item in tableList" :value="item.name">
                {{item.name}}
            </option>
        </select>
        <template v-else>
            <slot name="default"></slot>
            <div @click="clear">X</div>
        </template>
    </div>
</template>
<script>
import ajax from '../../../api/ajax';
export default {
    props: {
        sourceId: String,
        value: String
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            tableList: [],
            data: ''
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
        value(val) {
            this.data = val;
        }
    }
}
</script>
<style scoped lang="less">

</style>