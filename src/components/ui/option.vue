<template>
    <div class="option" :is="option">
        ss
    </div>
</template>
<script>
export default {
    name: 'uiOption',
    props: {},
    data() {
        return {
            currentValue: this.value
        };
    },
    methods: {
        changeFile() {
            this.currentValue = this.$refs.file.files;
        }
    }
}
</script>
<style scoped lang="less">
    .option {
        width: 100%;
        height: 24px;
        line-height: 24px;
        cursor: pointer;
        padding: 0 10px;
        &:hover {
            background-color: #c5c5c5;
        }
    }
</style>