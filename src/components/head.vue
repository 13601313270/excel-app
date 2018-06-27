<template>
    <div>
        头部
    </div>
</template>
<script>
export default {
    props: ['data', 'randomId'],
    data() {
        return {
            datas: {}
        };
    }
}
</script>
<style scoped lang="less">
    .widget {
        border: solid 1px black;
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
    }

    table {
        border-collapse: collapse;
        td {
            border: solid 1px black;
        }

    }
</style>