<template>
    <popupBackground class="center">
        <ui-window>
            <div class="text" v-html="text"></div>
            <ui-button @click="ok">确定</ui-button>
            <ui-button @click="cancel">否定</ui-button>
        </ui-window>
    </popupBackground>
</template>
<script>
import popupBackground from '../ui/popupBackground.vue';
import uiButton from '../ui/button.vue';
import uiWindow from '../ui/window.vue';
export default {
    props: ['text'],
    data() {
        return {};
    },
    methods: {
        ok() {
            this.$emit('ok');
        },
        cancel() {
            this.$emit('cancel');
        }
    },
    components: {
        popupBackground, uiButton, uiWindow
    }
}
</script>
<style scoped lang="less">
    @import "../ui/basic";

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
            padding-bottom: @ui_panel_margin_y;
        }
    }
</style>
