<template>
    <div style="display: flex">
        <select
            v-if="typeof data === 'string'"
            @change="change"
            v-model="data"
        >
            <option v-for="(item,key) in columnObj" :value="key">
                {{item.title}}
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
        table: String,
        value: [String, Object]
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            columnObj: [],
            data: this.value
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
    }
}
</script>
<style scoped lang="less">

</style>