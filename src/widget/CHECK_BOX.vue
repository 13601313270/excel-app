<template>
    <div @click="change" class="check">
        <div class="inner" :class="{active:isCheck}"></div>
    </div>
</template>
<script>
export default {
    props: {
        value: Boolean
    },
    data() {
        return {
            isCheck: this.value
        };
    },
    methods: {
        change() {
            this.isCheck = !this.isCheck;
            this.$emit('input', this.isCheck);
            this.$emit('change', this.isCheck);
        }
    },
    watch: {
        'value'(val) {
            this.isCheck = val;
        }
    }
}
</script>
<style scoped lang="less">
    .check {
        width: 40px;
        border: solid 1px #bababa;
        border-radius: 20px;
        display: inline-block;
        height: 24px;
        position: relative;
        .inner {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: gray;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: left .3s, background-color .5s;
            &.active {
                left: 18px;
                background-color: #378070;
            }
        }
    }
</style>
