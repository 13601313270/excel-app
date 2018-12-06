<template>
    <popupBackground class="center">
        <ui-window @close="cancel">
            <div>
                <div v-for="item in inputPropts" class="item">
                    <h3 v-html="item.title"></h3>
                    <input v-if="item.type===Number" v-model.number="saveData[item.name]" type="number"/>
                    <input v-else-if="item.type===Boolean" v-model="saveData[item.name]" type="checkbox"/>
                    <input v-else v-model="saveData[item.name]"/>
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
        inputPropts: {
            type: Array
        }
    },
    data() {
        let saveData = {};
        this.inputPropts.forEach(item => {
            if(item.type === Number) {
                saveData[item.name] = NaN;
            } else if(item.type === Boolean) {
                saveData[item.name] = false;
            } else {
                saveData[item.name] = '';
            }
        });
        return {
            saveData: saveData
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