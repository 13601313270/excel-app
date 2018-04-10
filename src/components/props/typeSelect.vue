<template>
    <div style="display: inline-block">
        <div v-if="(dataType!=='' && dataType.split(',').length === 1)">
            <span
                v-for="item in allMatch"
                v-if="item.type === dataType"
                v-html="item.title">
            </span>
        </div>
        <select
            v-else
            :value="value"
            @change="changeType($event.target.value)">
            <option
                v-for="item in allMatch"
                v-if="item.name && (dataType===''||dataType.split(',').includes(item.type))"
                :value="item.name">
                {{item.title}}
            </option>
            <option value="var" v-if="(dataType===''||dataType.split(',').includes('var'))">变量
            </option>
        </select>
    </div>
</template>
<script>
import allMatch from '../../languageParser/allMatch';
export default {
    props: {
        value: {},
        dataType: ''
    },
    computed: {},
    data() {
        return {
            allMatch: allMatch
        };
    },
    mounted() {
    },
    methods: {
        changeType(val) {
            this.$emit('change', val);
        }
    }
}
</script>