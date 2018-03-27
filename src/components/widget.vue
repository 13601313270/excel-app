<template>
    <div>
        <div class="widget" :class="{warning:getHighlightState(data_)=='info'}"
             ref="content"
             @dragover="allowDrop($event)"
             @drop="ondrop($event)"></div>
    </div>
</template>
<script>
export default {
    props: ['data', 'randomId'],
    data() {
        return {
            data_: this.data
        };
    },
    mounted() {
        if (this.data !== undefined) {
            this.$emit('init', this.data, this.randomId, this.$refs.content);
        }
    },
    methods: {
        getHighlightState(type) {
            // return this.$store.state.varHighlight.key;
            if (this.$store.state.varHighlight.key === type) {
                return this.$store.state.varHighlight.info;
            }
            return 'none';
        },
        allowDrop(e) {
            e.preventDefault();
        },
        ondrop(e) {
            let varName = window.prompt('请输入名称', 'a7');
            varName = '$' + varName.replace(/^\$/, '');
            this.data_ = varName;
            if (varName !== null) {
                this.$emit('change', varName, this.randomId, this.$refs.content);
            }
        }
    }
}
</script>
<style scoped>
    .warning {
        background-color: rgba(193, 42, 12, 0.71);
    }

    .widget {
        border: solid 1px black;
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
    }
</style>