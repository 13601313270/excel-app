<template>
    <div class="input_content" :class="{mini:size==='mini'}">
        <input v-model="currentValue" :type="type"/>
    </div>
</template>
<script>
export default {
    name: 'uiInput',
    props: {
        value: [String, Number],
        size: String,
        type: String
    },
    data() {
        return {
            currentValue: this.value
        };
    },
    watch: {
        value(value) {
            this.currentValue = value;
        },
        currentValue(value) {
            this.$emit('input', value);
            this.$emit('change', value)
        }
    }
}
</script>
<style scoped lang="less">
    @import "basic";

    .input_content {
        height: @form_default_height;
        display: inline-block;
        .ui_panel;
        padding: 0;
        color: black;
        input {
            height: @form_default_height - @ui_panel_borderWidth*2;
            padding: 0 3px;
            border: none;
            &:focus {
                outline: none;
            }
        }

        &.mini {
            height: @form_mini_height;
            input {
                height: @form_mini_height - @ui_panel_borderWidth*2;
            }
        }
    }
</style>