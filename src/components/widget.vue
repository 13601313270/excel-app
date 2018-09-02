<template>
    <div>
        <div class="widget" :class="{warning:getHighlightState(data_)=='info'}"
             ref="content"
             @dragover="allowDrop($event)"
             @drop="ondrop($event)"></div>
    </div>
</template>
<script>
import widgetEvent from './widgetChange';
import widgetIdToVar from './widgetIdToVar';
import { mapGetters } from 'vuex';
export default {
    name: 'widget',
    props: ['data'],
    data() {
        return {
            data_: this.data,
            key: this.$vnode.key
        };
    },
    mounted() {
        if(this.data !== undefined) {
            widgetEvent.emit('init', this.data, this.key, this.$refs.content);
            this.$emit('init', this.data, this.key, this.$refs.content);
        } else {
            let key = widgetIdToVar[this.key];
            this.data_ = key;

            widgetEvent.emit('init', this.data_, this.key, this.$refs.content);
            this.$emit('init', this.data_, this.key, this.$refs.content);
        }
    },
    methods: {
        getHighlightState(type) {
            // return this.$store.state.varHighlight.key;
            if(this.varHighlight.key === type) {
                return this.varHighlight.info;
            }
            return 'none';
        },
        allowDrop(e) {
            e.preventDefault();
        },
        ondrop(e) {
            // 如果没有设置key，则不允许拖拽widget，用来定义不可修改组件。反过来说，所有添加了key的widget可以拖拽组件
            if(this.key !== undefined) {
                let varName = window.prompt('请输入名称', 'a7');
                if(varName !== null) {
                    varName = '$' + varName.replace(/^\$/, '');
                    this.data_ = varName;
                    widgetEvent.emit('change', varName, this.key, this.$refs.content);
                    this.$emit('change', varName, this.key, this.$refs.content);
                }
            }
        }
    },
    computed: {
        ...mapGetters('main', ['varHighlight', 'dragDomFunc'])
    }
}
</script>
<style scoped lang="less">
    .warning {
        background-color: rgba(193, 42, 12, 0.71);
    }

    .widget {
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
    }
</style>
<style>
    .warning input {
        background-color: rgba(255, 255, 255, 0.21);
    }
</style>