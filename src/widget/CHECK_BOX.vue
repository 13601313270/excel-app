<template>
    <div @click="jjj"
         style="width: 40px;border: solid 1px #bababa;border-radius: 20px;display: inline-block;height: 24px;position: relative">
        <div
            style="position: absolute;width: 20px;height: 20px;background-color: gray;border-radius: 50%;top: 2px;left: 2px;"
            v-html="name"></div>
    </div>
</template>
<script>
export default {
    props: {
        name: String
    },
    data() {
        return {};
    },
    methods: {
        jjj() {
            this.$emit('change', 1);
        }
    }
}
</script>
<style scoped lang="less">

</style>