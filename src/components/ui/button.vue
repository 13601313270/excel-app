<template>
    <div class="button_content" :class="{mini:size==='mini'}" @click="$emit('click')">
        <div>
            <div class="icon" v-html="icon" v-if="icon"></div>
            <slot></slot>
        </div>
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
        .ui_panel;
        .ui_can_be_click;
        display: inline-block;
        color: black;
        > div {
            display: inline-flex;
            .icon {
                font-family: iconfont;
                margin-left: -7px;
                margin-right: 6px;
            }
        }
    }
</style>