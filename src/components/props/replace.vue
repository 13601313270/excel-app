<template>
    <div>
        <div v-if="type==='RELATIONAL_MODEL=>source'">
            <select @change="change" v-model="data">
                <option v-for="item in connections" :value="parseInt(item.id)">
                    {{item.name}}
                </option>
            </select>
        </div>
        <div v-else-if="type==='RELATIONAL_MODEL=>table'">
            <relation-model-table :sourceId="props[0]" @change="change" v-model="data">
                <slot name="default"></slot>
            </relation-model-table>
        </div>
        <div v-else-if="type==='RELATIONAL_MODEL=>x'">
            <relation-model-x :sourceId="props[0]" :table="props[1]" @change="change" v-model="data">
                <slot name="default"></slot>
            </relation-model-x>
        </div>
        <div v-else-if="type==='RELATIONAL_MODEL=>y'">
            <relation-model-y :sourceId="props[0]" :table="props[1]" :dataType="dataType" @change="change"
                              v-model="data">
                <slot name="default"></slot>
            </relation-model-y>
        </div>
        <div v-else>
            <slot name="default"></slot>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import relationModelTable from './replace/RELATIONAL_MODEL__table.vue'
import relationModelX from './replace/RELATIONAL_MODEL__x.vue'
import relationModelY from './replace/RELATIONAL_MODEL__y.vue'
export default {
    name: 'replace',
    components: {
        relationModelTable, relationModelX, relationModelY
    },
    props: {
        type: String,
        value: {},
        // 本函数其他参数输入值
        props: {
            type: Array
        },
        // 函数定义规定的数据应该
        dataType: String
    },
    data() {
        return {
            data: this.value
        };
    },
    mounted() {
        if(this.type === 'RELATIONAL_MODEL=>source') {
            /**
             ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/action/mysql.html',
                data: {
                    type: 'showCreateTable',
                    connection: this.props[0],
                    table: 'excel'
                }
            }).then((data) => {
                console.log(data);
            });
             */
        }
    },
    methods: {
        change() {
            this.$emit('input', this.data);
            this.$emit('change');
        }
    },
    computed: {
        ...mapGetters('main', ['connections'])
    },
    watch: {
        value(val) {
            this.data = val;
        }
    }
}
</script>
<style scoped lang="less">

</style>