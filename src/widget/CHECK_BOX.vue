<template>
    <div @click="change" class="check" :style="{width:width+'px',height:width/2+4+'px',borderRadius:width/2+'px'}">
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
            isCheck: this.value,
            width: 60
        };
    },
    methods: {
        change() {
            this.isCheck = !this.isCheck;
            this.$emit('input', this.isCheck);
            this.$emit('change', this.isCheck);
        },
        resize(size) {
            this.width = Math.min(size.width, (size.height - 4) * 2) - 8;
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
            width: 50%;
            height: calc(100% - 4px);
            background-color: gray;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: left .3s, background-color .5s;

            &.active {
                left: calc(50% - 2px);
                background-color: #378070;
            }
        }
    }
</style>
