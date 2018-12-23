<template>
    <div class="drop_list">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'uiDropList',
    props: [],
    data() {
        return {};
    },
    methods: {}
}
</script>
<style scoped lang="less">
    @import "basic";

    .drop_list {
        .ui_panel_weight;
        padding-left: 0;
        padding-right: 0;
        min-width: 100px;
        > * {
            .ui_can_be_click;
            padding: 0 10px;
            text-align: center;
            line-height: @ui_min_click_height;
        }
    }
</style>