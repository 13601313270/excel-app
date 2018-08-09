<template>
    <div>
        <div v-if="type==='RELATIONAL_MODEL_source'">
            <select @change="change" v-model="data">
                <option v-for="item in connections" :value="item.id">
                    {{item.name}}
                </option>
            </select>
        </div>
        <div v-else>
            <slot name="default"></slot>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        type: String,
        value: {},
        dataType: String
    },
    data() {
        return {
            data: this.value
        };
    },
    methods: {
        change() {
            this.$emit('input', this.data);
            this.$emit('change');
        }
    },
    computed: {
        ...mapGetters('main', ['connections'])
    }
}
</script>
<style scoped lang="less">

</style>