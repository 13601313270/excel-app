<template>
    <div class="table">
        <div class="content">
            <table>
                <thead>
                <tr>
                    <td v-for="item in value.groupColumn" v-html="item"></td>
                    <td v-for="item in value.dataColumn" v-html="item"></td>
                </tr>
                </thead>
                <tbody v-if="value.dataValue">
                <tr v-for="data in value.dataValue.slice(pageSize * page, pageSize * (page + 1) )">
                    <td v-for="item in data" v-html="item"></td>
                </tr>
                </tbody>
            </table>
        </div>
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
    methods: {},
    watch: {
        value(val) {
            console.log('-----this.value-----');
            console.log(JSON.stringify(val));
            console.log(val);
        }
    }
}
</script>
<style scoped lang="less">
    .table {
        padding: 10px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .content {
            flex-grow: 1;
            table {
                width: 100%;
                border-spacing: 0;
                flex-grow: 1;
                thead {
                    font-weight: bold;
                }
                tr {
                    td {
                        border-bottom: solid 1px #c7c7c7;
                        padding: 2px 10px;
                    }
                }
            }
        }

        .page {
            margin-top: 10px;
            > * {
                float: left;
                height: 26px;
                min-width: 16px;
                border-radius: 2px;
                border: solid 1px #c7c7c7;
                padding: 1px 3px;
                cursor: pointer;
                margin-left: 2px;
                text-align: center;
                line-height: 26px;
                &.active {
                    border: solid 1px black;
                    font-weight: bold;
                    background-color: darkslategrey;
                    color: white;
                }
            }
            &:after {
                content: '';
                display: block;
                clear: both;
            }
        }
    }
</style>