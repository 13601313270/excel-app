<template>
    <div class="window_content">
        <div class="panel-heading">
            <div class="name" v-html="title"></div>
            <div class="tools">
                <ui-button @click.native.stop="closeWindow">X</ui-button>
            </div>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'uiWindow',
        props: ['title', 'isCanClose'],
        data() {
            return {};
        },
        methods: {
            closeWindow() {
                this.$emit('close');
            }
        }
    }
</script>
<style scoped lang="less">
    @import "basic";

    .window_content {
        .ui_panel;
        padding: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 100px -20px #ffffff30;

        .panel-heading {
            .ui_panel;
            border: none;
            flex-shrink: 0;
            border-radius: 0;
            border-bottom: solid 1px @ui_panel_borderColor;
            background-color: #f5f5f5;
            display: flex;
            padding-top: 5px;
            padding-bottom: 5px;

            .name {
                .ui_single_text;
                flex-grow: 1;
                line-height: 28px;
            }

            .tools {
                flex-grow: 0;

                > * {
                    .ui_can_be_click;
                    float: left;
                }
            }
        }

        .body {
            .ui_panel;
            flex-grow: 1;
            border: none;
            border-radius: 0;
            box-shadow: none;
            overflow: scroll;
        }
    }
</style>