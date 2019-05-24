<template>
    <div class="all">
        <div v-if="(showMatch.length+((dataType===''||dataType.split(',').includes('var'))?1:0))===1">
            <span
                    v-for="item in showMatch"
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
            <option value="var" v-if="hasTypeValue">变量</option>
        </select>
    </div>
</template>
<script>
    import allMatch from '../../languageParser/allMatch';
    import allVar from '../../observer/allVar';

    export default {
        name: 'typeSelect',
        props: {
            value: {},
            dataType: ''
        },
        computed: {
            showMatch() {
                return this.allMatch.filter((item) => {
                    if (item.name) {
                        if (this.dataType === '') {
                            return true;
                        } else {
                            if (item.type === 'function') {
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
            },
            hasTypeValue() {
                return Object.values(this.allVar).findIndex(item => {
                    if (typeof item.value === 'object') {
                        return this.dataType.includes(item.value.type);
                    } else {
                        return this.dataType.includes(item.value);
                    }
                }) > -1;
            }
        },
        data() {
            return {
                allMatch: allMatch,
                allVar: allVar.getAllData()
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