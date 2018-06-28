<template>
    <div>
        <h2>容器</h2>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>TAB</div>
        <div>折叠面板</div>

        <h2>表单</h2>
        <div draggable="true" @dragstart='drag("INPUT")'>输入框</div>
        <div draggable="true" @dragstart='drag("INPUT_DATE")'>日期</div>
        <!--<div draggable="true" @dragstart='drag($event)'>下拉框</div>-->
        <div draggable="true" @dragstart='drag("CHECK_BOX")'>开关器</div>
        <div draggable="true" @dragstart='drag("TEXT")'>文本</div>

        <h2>图表</h2>
        <div draggable="true" @dragstart='drag("BAR")'>柱状图</div>

        <h2>计算</h2>
        <div draggable="true" @dragstart='drag("MIN")'>最小值</div>
        <div draggable="true" @dragstart='drag("IF")'>IF判断</div>
    </div>
</template>
<script>
export default {
    props: ['data', 'randomId'],
    data() {
        return {};
    },
    methods: {
        drag(type) {
            this.$emit('drag', type);
        }
    }
}
</script>
<style scoped lang="less">
</style>