<template>
    <div
        style="position: relative;height: 100%;overflow: auto;width: 100%;"
    >
        <div>
            <div @click="fullScreen">全屏</div>
        </div>
        <div
            style="position:absolute;top:20px;left:0;height: 100%;overflow: auto;width: 100%;z-index: 1;display: flex;">
            <div style="overflow: auto;">
                <div
                    v-for="(item,index) in data"
                    @click="selectPage=index"
                    class="page"
                    :class="{active:selectPage==index}">
                </div>
                <div class="page" style="height:30px;" @click="data.push([])">+</div>
            </div>
            <div :class="{'full-screen':isFullScreen}">
                <div
                    v-for="(item,pageIndex) in data"
                    @drop="addData($event,pageIndex)"
                    v-show="selectPage===pageIndex"
                    @dragover="$event.preventDefault()"
                    style="width:600px;height:450px;border: solid 1px black;position: relative;">
                    <div
                        v-if="drag"
                        @mouseup="drag=false"
                        @mouseleave="drag=false"
                        @mousemove.self="mousemove($event,pageIndex)"
                        style="position:absolute;top:0;left:0;width: 100%;height:100%;background-color: rgba(255,0,0,0);z-index: 2;"></div>
                    <template v-for="(item,index) in data[pageIndex]">
                        <div
                            :ref="'widgetContent'+item.randomId"
                            class="widget-panel"
                            style="position:absolute;"
                            :style="{left:item.style.x+'px',top:item.style.y+'px'}"
                            @mousedown.self="mousedown(index)"
                        >
                            <widget
                                class="widget"
                                contenteditable="false"
                                :data="item.data"
                                :random-id="item.randomId"
                                :ref="item.randomId"
                            ></widget>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import widget from '../widget.vue';
import widgetEvent from '../widgetChange';
export default {
    props: ['dragDomFunc'],
    data() {
        return {
            drag: false,
            dragObjIndex: -1,
            selectPage: 0,
            data: [[], [], []],
            isFullScreen: false,
            setIntervalObj: null,
        };
    },
    mounted() {
        this.setIntervalObj = setInterval(() => {
            console.log(1);
            if(this.isFullscreen() === false) {
                this.isFullScreen = false;
            }
        }, 1000);
    },
    methods: {
        mousedown(index) {
            this.dragObjIndex = index;
            this.drag = true;
            console.log(1);
        },
        mousemove(e, pageIndex) {
            if(this.drag) {
                this.data[pageIndex][this.dragObjIndex].style.x = e.offsetX;
                this.data[pageIndex][this.dragObjIndex].style.y = e.offsetY;
            }
        },
        addData(e, index) {
            console.log(e);
            let randomId = 'r' + parseInt(Math.random() * 1000000);
            let varName = window.prompt('请输入名称', 'a7');
            if(varName !== null) {
                varName = '$' + varName.replace(/^\$/, '');
                this.data[index].push({
                    data: varName,
                    randomId: randomId,
                    style: {
                        x: e.offsetX,
                        y: e.offsetY
                    }
                });
                if(varName !== null) {
                    this.$nextTick(() => {
                        widgetEvent.emit('change', varName, randomId, this.$refs[randomId][0].$refs.content);
                    });
                }
            }
        },
        fullScreen() {
            this.isFullScreen = true;
            let el = document.documentElement;
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if(typeof rfs !== 'undefined' && rfs) {
                rfs.call(el);
            }
        },
        isFullscreen() {
            return document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement || false;
        }
    },
    beforeDestroy() {
        clearInterval(this.setIntervalObj);
    },
    components: {
        widget
    }
}
</script>
<style scoped lang="less">
    .widget-panel {
        border: solid 1px black;
        padding: 5px;
    }

    .page {
        width: 80px;
        height: 60px;
        margin: 10px;
        border: solid 1px black;
        cursor: pointer;
        &.active {
            box-shadow: #a4a9ff 0 0 1px 3px;
        }
    }

    .full-screen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
    }
</style>