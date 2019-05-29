<template>
    <div class="button_content" :class="{mini:size==='mini'}" @click="$emit('click')">
        <div class="icon" v-html="icon" v-if="icon"></div>
        <div><slot></slot></div>
    </div>
</template>
<script>
    export default {
        name: 'uiButton',
        props: {
            size: String,
            icon: String
        },
        data() {
            return {};
        },
        methods: {}
    }
</script>
<style scoped lang="less">
    @import "basic";

    .button_content {
        .ui_panel;
        .ui_can_be_click;
        .form_size;
        padding: 0 10px;

        // .ao(1);
        color: black;
        white-space: nowrap;
        text-align: center;

        display: inline-flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;


        .icon {
            font-family: iconfont;
            margin-right: 6px;
        }
    }
</style>