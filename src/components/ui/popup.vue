<template>
    <div class="popup">
        <div class="popup_content">
            <slot></slot>
            <div class="close" @click="close">X</div>
        </div>
    </div>
</template>
<script>
export default {
    props: [],
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>
<style scoped lang="less">
    .popup {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: scroll;
        padding: 10px 0;
        &:before {
            content: "";
            position: fixed;
            background-color: rgba(53, 53, 53, 0.70);
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 1000;
        }
        .popup_content {
            display: table;
            background-color: white;
            min-width: 300px;
            z-index: 1001;
            padding: 10px;
            position: relative;
            .close {
                position: absolute;
                top: 0;
                right: -20px;
                cursor: pointer;
                color: white;
            }
        }
    }
</style>
