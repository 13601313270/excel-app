<template>
    <div class="button_content" :class="button_class" @click="$emit('click')">
        <div class="icon" v-html="icon" v-if="icon"></div>
        <div class="inner"><slot></slot></div>
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
        computed: {
            button_class() {
                let obj = {};
                obj[this.size] = true;
                return obj;
            }
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
        .inner {
        }


        .icon {
            font-family: iconfont;
            margin-right: 6px;
        }
    }
</style>
