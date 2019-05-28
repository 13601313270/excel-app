<template>
    <div class="input_content" :class="{mini:size==='mini'}">
        <input ref="file" v-if="type==='file'" @change="changeFile" :type="type"/>
        <input v-else v-model="currentValue" :type="type"/>
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
    },
    methods: {
        changeFile() {
            this.currentValue = this.$refs.file.files;
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
        input {
            height: 100%;
            width: 100%;
            padding: 0 3px;
            border: none;
            &:focus {
                outline: none;
            }
        }
    }
</style>