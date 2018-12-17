<template>
    <div>
        <table>
            <thead>
            <tr>
                <td v-for="item in value.groupColumn" v-html="item"></td>
                <td v-for="item in value.dataColumn" v-html="item"></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in value.dataValue.slice(pageSize * page, pageSize * (page + 1) )">
                <td v-for="item in data" v-html="item"></td>
            </tr>
            </tbody>
        </table>
        <div class="page" v-if="value && value.dataValue && value.dataValue.length">
            <div
                :class="{active:page===key}"
                v-for="(item,key) in Array(Math.ceil(value.dataValue.length / pageSize))"
                @click="page=key"
                v-html="key+1"
            ></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: Object,
        pageSize: Number
    },
    data() {
        return {
            page: 0
        };
    },
    methods: {}
}
</script>
<style scoped lang="less">
    td {
        border: solid 1px #616161;
    }

    .page {
        > * {
            float: left;
            border: solid 1px black;
            padding: 1px 3px;
            cursor: pointer;
            &.active {
                background-color: darkslategrey;
                color: white;
            }
        }
    }
</style>