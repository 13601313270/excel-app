<template>
    <popupBackground class="center">
        <ui-window @close="cancel">
            <div class="text">
                <div v-html="text"></div>
                <input v-model="inputValue"/>
            </div>
            <ui-button @click="ok">确定</ui-button>
            <ui-button @click="cancel">否定</ui-button>
            <div class="error" v-if="errorMessage">{{errorMessage}}</div>
        </ui-window>
    </popupBackground>
</template>
<script>
import popupBackground from '../ui/popupBackground.vue';
import uiButton from '../ui/button.vue';
import uiWindow from '../ui/window.vue';

export default {
    props: {
        text: String,
        initValue: String,
        check: Function
    },
    data() {
        return {
            inputValue: this.initValue,
            errorMessage: ''
        };
    },
    methods: {
        ok() {
            if(this.check instanceof Function) {
                let result = this.check(this.inputValue);
                if(result === true) {
                    this.$emit('ok', this.inputValue);
                } else {
                    if(result === false) {
                        this.errorMessage = '错误'
                    } else {
                        this.errorMessage = result
                    }
                }
            } else {
                this.$emit('ok', this.inputValue);
            }
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

        .error {
            color: @form_error_color;
        }
    }
</style>
