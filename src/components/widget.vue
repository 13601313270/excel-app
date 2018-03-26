<template>
    <div class="widget" ref="content" @dragover="allowDrop($event)" @drop="ondrop($event)"></div>
</template>
<script>
export default {
    props: ['data', 'randomId'],
    data() {
        return {};
    },
    mounted() {
        if (this.data !== undefined) {
            this.$emit('init', this.data, this.randomId, this.$refs.content);
        }
    },
    methods: {
        allowDrop(e) {
            e.preventDefault();
        },
        ondrop(e) {
            let varName = window.prompt('请输入名称', 'a7');
            if (varName !== null) {
                this.$emit('change', varName, this.randomId, this.$refs.content);
            }
        }
    }
}
</script>
<style scoped>
    .widget {
        border: solid 1px black;
        min-width: 20px;
        min-height: 20px;
        display: inline-block;
    }
</style>