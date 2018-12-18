<template>
    <div class="button_content" :class="{mini:size==='mini'}" @click="$emit('click')">
        <div class="icon" v-html="icon" v-if="icon"></div>
        <slot></slot>
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

    .mini {
        height: @form_mini_height;
        padding: 7px 15px !important;
        font-size: 12px;
        line-height: 12px;
    }

    .button_content {
        display: inline-flex;
        .ui_panel;
        .ui_can_be_click;
        color: black;
        .icon {
            font-family: iconfont;
            margin-left: -7px;
            margin-right: 6px;
        }
    }
</style>