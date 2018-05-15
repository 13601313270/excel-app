<template>
    <div>
        <div class="a" style="width: 100px;height:100px;left:100px;top:100px"></div>
        <div class="b" style="width: 20px;height:100px;left:300px;top:100px"></div>
        <div class="c" style="width: 100px;height:100px;left:500px;top:100px"></div>
        <div class="d" style="width: 100px;height:100px;left:700px;top:100px"></div>
        <div class="e" style="width: 100px;height:100px;left:900px;top:100px"></div>


        <div class="button" style="left:100px;top:250px;color:#cb6036;">确定</div>
        <div class="button2" style="left:250px;top:250px">
            <div
                style="width: 20px;height:20px;border-radius: 30px;margin-top:5px;margin-left:40px;background-color: #cb6036;"></div>
        </div>
        <div class="button3" style="left:370px;top:250px">
            <div
                style="width: 20px;height:20px;border-radius: 30px;margin-top:5px;margin-left:40px;background-color: #cb6036;"></div>
        </div>
        <div class="button4" style="left:490px;top:250px">
            <div
                style="width: 20px;height:20px;border-radius: 30px;margin-top:5px;margin-left:40px;background-color: #cb6036;"></div>
        </div>
        <div class="button5" style="left:610px;top:250px">
            <div
                style="width: 20px;height:20px;border-radius: 30px;margin-top:5px;margin-left:40px;background-color: #cb6036;"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {},
    mounted() {
    }
}
</script>
<style scoped lang="less">
    div {
        position: absolute;
        background-color: #dedede;
    }

    @lightHeight: 200;
    @lightAngle: pi()/5;
    /*获取光源阴影*/
    .shaow(@zIndex,@width) {
        @blur: @zIndex*0.8;
        @spread: ((@lightHeight*@width/(@lightHeight - @zIndex) - @width)/2);
        box-shadow+: 0 unit(tan(@lightAngle)*@zIndex, px) unit(@blur, px) unit(@spread, px) rgba(0, 0, 0, 0.40);
    }

    /*增加厚度*/
    .weight() {
        box-shadow+: 0 1px 0 0 #333, inset 0 1px 1px -1px rgba(255, 255, 255, 0.6);
    }

    /*凹进去*/
    .ao(@deep) {
        box-shadow+: inset 0 unit(tan(@lightAngle)*@deep, px) unit(@deep*0.5, px) 0 rgba(0, 0, 0, 0.56),
        0 1px 2px 0 white,
        inset 0 unit(@deep*2*-1, px) 8px -1px rgba(255, 255, 255, 0.45);
    }

    .a {
        .shaow(0, 10px);
    }

    .b {
        .shaow(10, 10px);
    }

    .c {
        .shaow(20, 10px);
    }

    .d {
        .shaow(30, 10px);
    }

    .e {
        .shaow(50, 10px);
    }

    .button {
        .shaow(10, 100px);
        border-radius: 5px;
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        .weight;
        @deep: 1;
    }

    .button2 {
        .button;
    }

    .button3 {
        .button;
        > div {
            .ao(1);
        }
    }

    .button4 {
        .button;
        > div {
            .ao(3);
        }
    }

    .button5 {
        .button;
        > div {
            .ao(5);
            background-color: saturate(#cb6036, 10%) !important;
            /*box-shadow+: 0 0 13px 1px #ff4700;*/
        }
    }
</style>
