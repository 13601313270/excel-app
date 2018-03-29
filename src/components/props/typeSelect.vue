<template>
    <select :value="value" @change="changeType($event.target.value)">
        <option v-for="item in allMatch"
                v-if="item.name && (dataType===''||dataType.split(',').includes(item.type))"
                :value="item.name">
            {{item.title}}
        </option>
        <option value="var" v-if="(dataType===''||dataType.split(',').includes('var'))">变量
        </option>
    </select>
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