<template>
    <div class="input_content" :class="input_class">
        <input ref="file" v-if="type==='file'" @change="changeFile" :type="type"/>
        <input v-else v-model="currentValue" :type="type" @focus="inputFocus" @blur="inputBlue"/>
    </div>
</template>
<script>
export default {
    name: 'uiInput',
    props: {
        value: [String, Number, File, FileList, Boolean],
        size: String,
        type: String
    },
    data() {
        return {
            currentValue: this.value,
            focus: false
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
    },
    computed: {
        input_class() {
            let obj = {focus: this.focus};
            obj[this.size] = true;
            return obj;
        }
    },
    methods: {
        changeFile() {
            this.currentValue = this.$refs.file.files;
        },
        inputFocus() {
            this.focus = true;
        },
        inputBlue() {
            this.focus = false;
        }
    }
}
</script>
<style scoped lang="less">
    @import "basic";

    .input_content {
        .ui_panel;
        .form_size;
        display: inline-block;
        padding: 0;
        color: black;
        border-radius: 1px;
        transition: border-color .3s;
        input {
            height: 100%;
            width: 100%;
            padding: 0 3px;
            border: none;
            &:focus {
                outline: none;
            }
        }
        &.focus {
            border-color: @form_focus_color;
        }
    }
</style>