<template>
    <div>
        <div>文件保存</div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <widget v-for="(item,key) in fileData.widget" :key="'w'+key"></widget>
        <div @click="add">click</div>
    </div>
</template>
<script>
import widget from '../widget.vue';
// import widgetEvent from '../widgetChange';
// import ajax from '../../api/ajax';
export default {
    props: ['fileData'],
    created() {
        console.log('-----this.fileData-----');
        console.log(this.fileData);
    },
    methods: {
        add() {
            this.fileData.widget.push(1);
            this.$emit('save');
        }
    },
    components: {
        widget
    }
}
</script>
<style scoped lang="less">
</style>