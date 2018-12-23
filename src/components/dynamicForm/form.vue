<template>
    <popupBackground class="center">
        <ui-window @close="cancel">
            <div>
                <div v-for="item in inputProps" class="item" :key="item.name">
                    <h3 v-html="item.title"></h3>
                    <select v-if="item.enum" v-model="saveData[item.name]">
                        <option :value="key2" v-for="(item2,key2) in item.enum" v-html="item2"></option>
                    </select>
                    <ui-input size="mini" v-else-if="item.type===File" v-model="saveData[item.name]"
                              type="file"/>
                    <ui-input size="mini" v-else-if="item.type===Number"
                              v-model.number="saveData[item.name]"
                              type="number"/>
                    <ui-input size="mini" v-else-if="item.type===Boolean" v-model="saveData[item.name]"
                              type="checkbox"/>
                    <ui-input size="mini" v-else v-model="saveData[item.name]"/>
                </div>
                <div style="display: flex;margin-top: 20px;">
                    <pt-button style="margin: 0 auto;" @click="save">保存</pt-button>
                </div>
            </div>
        </ui-window>
    </popupBackground>
</template>
<script>
import popupBackground from '../ui/popupBackground.vue';
import uiWindow from '../ui/window.vue';
import ptButton from '../ui/button.vue';
export default {
    props: {
        inputProps: {
            type: Array
        },
        initData: {
            type: Object,
            default: {}
        }
    },
    data() {
        let saveData = {};
        this.inputProps.forEach(item => {
            console.log(item.type);
            if(item.type === Number) {
                saveData[item.name] = this.initData[item.name] || item.default || NaN;
            } else if(item.type === Boolean) {
                saveData[item.name] = this.initData[item.name] || item.default || false;
            } else if(item.type === File) {
                saveData[item.name] = null;
            } else {
                saveData[item.name] = this.initData[item.name] || item.default || '';
            }
        });
        return {
            saveData: saveData,
            File: File
        };
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        save() {
            this.$emit('save', this.saveData);
        }
    },
    components: {uiWindow, popupBackground, ptButton}
}
</script>
<style scoped lang="less">
    @import "../ui/basic";

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            h3 {
                width: 100px;
                margin: 0;
            }
            input {
                min-width: 200px;
                font-size: 15px;
            }
        }
        .text {
            padding-bottom: @ui_panel_margin_y;
        }
    }
</style>