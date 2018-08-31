<template>
    <div>
        <div>文件保存</div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <div v-for="(item,key) in fileData.widget">
            <widget :key="item"></widget>
            <div @click="deleteWidget(key)">delete</div>
        </div>
        <div @click="add">click</div>
    </div>
</template>
<script>
export default {
    props: ['fileData'],
    created() {
        if(this.fileData.widget === undefined) {
            this.$set(this.fileData, 'widget', []);
        }
    },
    methods: {
        add() {
            let widgetKey = 'widget_' + parseInt(Math.random() * 100000);
            this.fileData.widget.push(widgetKey);
            this.$emit('save');
        },
        deleteWidget(key) {
            this.fileData.widget.splice(key, 1);
            this.$emit('save');
        }
    }
}
</script>
<style scoped lang="less">
</style>