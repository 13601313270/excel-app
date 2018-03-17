<template>
    <div class="widget" ref="content" @dragover="allowDrop($event)" @drop="ondrop($event)"></div>
</template>
<script>
import allVar from '../allVar';
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
            var newData = window.addData(this.randomId);
            this.$refs.content.innerHTML = '';
            this.$refs.content.appendChild(newData.value_.dom);
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