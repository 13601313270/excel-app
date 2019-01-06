<template>
    <div class="input_content" :class="{mini:size==='mini'}">
        <div class="inner">
            <div v-html="value"></div>
            <div class="list_button">&#xe616;</div>
            <select v-model="currentValue">
                <slot></slot>
                <!--<option style="background-color: red"></option>-->
                <!--<option></option>-->
                <!--<option></option>-->
            </select>
        </div>
        <!--<div class="drop">-->
        <!--<slot></slot>-->
        <!--</div>-->
    </div>
</template>
<script>
export default {
    name: 'uiSelect',
    props: {
        value: [String, Number, File, FileList],
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
        font-family: 'iconfont';
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
        .inner {
            display: flex;
            height: 100%;
            padding: 0 6px;
            cursor: pointer;
            position: relative;
            .list_button {
                display: flex;
                align-items: center;
                text-align: center;
                justify-content: center;
                margin-left: 5px;
                width: 20px;
            }
            select {
                position: absolute;
                left: 0;
                width: 100%;
                height: 100%;
                /*opacity: 0;*/
                border: none;
            }
        }
        .drop {
            .ui_panel;
            padding: 0;
            margin-top: 4px;
            background-color: white;
            position: absolute;
        }
    }
</style>