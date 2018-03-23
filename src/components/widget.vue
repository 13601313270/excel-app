<template>
    <div class="widget" ref="content" @dragover="allowDrop($event)" @drop="ondrop($event)"></div>
</template>
<script>
import allVar from '../observer/allVar';
export default {
    props: ['data', 'randomId'],
    data() {
        return {};
    },
    mounted() {
        var data = allVar.getVar(this.data);
        if (data && data.value_.dom) {
            this.$refs.content.innerHTML = '';
            this.$refs.content.appendChild(data.value_.dom);
        }
    },
    methods: {
        allowDrop(e) {
            e.preventDefault();
        },
        ondrop(e) {
            this.$emit('change', this.randomId, this.$refs.content);
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