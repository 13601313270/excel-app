<template>
    <div class="window_content">
        <div class="panel-heading">
            <div class="name" v-html="title"></div>
            <div class="tools">
                <ui_button size="mini" @click="closeWindow">X</ui_button>
            </div>
        </div>
    </div>
</template>
<script>
import button from './button.vue';
export default {
    props: ['title', 'isCanClose'],
    data() {
        return {};
    },
    methods: {
        closeWindow() {
            this.$emit('close');
        }
    },
    created() {
        console.log(this);
    },
    components: {
        ui_button: button
    }
}
</script>
<style scoped lang="less">
    @import "basic";

    .window_content {
        .ui_panel_weight;
        padding: 0;
        .panel-heading {
            .ui_panel;
            border: none;
            border-radius: 0;
            border-bottom: solid 1px @ui_panel_borderColor;
            background-color: #f5f5f5;
            display: flex;
            .name {
                .ui_single_text;
                flex-grow: 1;
                line-height: 28px;
            }
            .tools {
                flex-grow: 0;
                > * {
                    .ui_can_be_click;
                }
            }
        }
    }
</style>