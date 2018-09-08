<template>
    <div class="button_content" :class="{mini:size==='mini'}" @click="$emit('click')">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        size: String
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
        padding: 7px 15px !important;
        font-size: 12px;
        line-height: 12px;
    }

    .button_content {
        display: inline-block;
        .ui_panel;
        .ui_can_be_click;
    }
</style>