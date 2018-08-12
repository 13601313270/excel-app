<template>
    <div class="all">
        <div v-if="(showMatch.length+((dataType===''||dataType.split(',').includes('var'))?1:0))===1">
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
                v-for="item in showMatch"
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
    computed: {
        showMatch() {
            return this.allMatch.filter((item) => {
                if(item.name) {
                    if(this.dataType === '') {
                        return true;
                    } else {
                        if(item.type === 'function') {
                            let mustType = item.returnType.split(',');
                            return this.dataType.split(',').some(item2 => {
                                return mustType.includes(item2);
                            });
                        } else {
                            return this.dataType.split(',').includes(item.type);
                        }
                    }
                } else {
                    return false;
                }
            });
        }
    },
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
<style scoped lang="less">
    .all {
        display: inline-block
    }
</style>