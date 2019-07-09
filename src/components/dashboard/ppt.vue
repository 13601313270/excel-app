<template>
    <div
        style="position: relative;height: 100%;overflow: auto;width: 100%;"
    >
        <div
            style="position:absolute;top:20px;left:0;height: 100%;overflow: auto;width: 100%;z-index: 1;display: flex;">
            <div style="overflow: auto;">
                <div
                    v-for="index in fileData.widget.length"
                    @click="selectPage=index-1"
                    class="page"
                    :class="{active:selectPage===index-1}">
                </div>
                <div class="page" style="height:30px;" @click="fileData.widget.push([])">+</div>
            </div>
            <div :class="{'full-screen':isFullScreen}" style="position: relative">
                <div
                    v-for="(pageInfo,pageIndex) in fileData.widget"
                    @drop="addData"
                    @dragleave="isDragover = false"
                    v-show="selectPage===pageIndex"
                    @dragover.prevent.self="dragover"
                    style="width:600px;height:450px;border: solid 1px black;position: relative;">
                    <template v-for="(item,index) in pageInfo">
                        <div
                            :ref="'widgetContent'+item.randomId"
                            class="widget-panel"
                            :style="item.style"
                        >
                            <div class="drag_tip" v-if="isEditing" @mousedown.prevent="moveId = item">&#xe656;</div>
                            <widget
                                class="widget"
                                :ref="'page'+pageIndex"
                                contenteditable="false"
                                :data="item.data"
                                :random-id="item.randomId"
                            ></widget>
                            <div class="drag_size" v-if="isEditing" @mousedown="sizeId = item"></div>
                        </div>
                    </template>
                    <div v-if="moveId || sizeId" class="move_back" @mousemove="mousemove" @mouseup="mouseup"></div>
                </div>
                <div :style="seatStyle" v-show="isDragover" class="droging-seat"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { prompt } from '../alert/prompt';
import cloneUtils from '../clone.utils';

export default {
    props: {
        fileData: Object,
        isEditing: Boolean,
        dragDomFunc: String,
        dragDomFuncInfo: Object,
        isFullScreen: Boolean
    },
    data() {
        return {
            // 拖拽占位尺寸
            seatStyle: {
                left: 0,
                top: 0,
                width: 10,
                height: 10
            },
            isDragover: false, // 正在拖拽函数进入dashboard
            moveId: null,
            sizeId: null,
            // adsf
            drag: false,
            selectPage: 0
        };
    },
    mounted() {
        if(this.fileData.widget === undefined) {
            this.$set(this.fileData, 'widget', [[]]);
        }
        console.log(this.fileData);
    },
    methods: {
        // 拖拽widge尺寸或大小
        mousemove(e) {
            let widget = this.fileData.widget[this.selectPage].find(item => {
                return item === (this.moveId || this.sizeId);
            });
            this.isDragover = true;
            if(this.moveId !== null) {
                this.seatStyle.left = parseInt(Math.max(e.offsetX, 10) / 10) * 10 + 'px';
                this.seatStyle.width = parseInt(parseInt(widget.style.width) / 10) * 10 + 'px';
                this.seatStyle.top = parseInt(Math.max(e.offsetY, 10) / 10) * 10 + 'px';
                this.seatStyle.height = parseInt(parseInt(widget.style.height) / 10) * 10 + 'px';
            } else if(this.sizeId !== null) {
                this.seatStyle.left = widget.style.left;
                this.seatStyle.width = parseInt(e.offsetX / 10) * 10 - parseInt(widget.style.left) + 'px';
                this.seatStyle.top = widget.style.top;
                this.seatStyle.height = parseInt(e.offsetY / 10) * 10 - parseInt(widget.style.top) + 'px';
            }
        },
        // 拖拽widge尺寸或大小结束
        mouseup() {
            let widgetIndex = this.fileData.widget[this.selectPage].findIndex(item => {
                return item === (this.moveId || this.sizeId);
            });
            if(widgetIndex > -1) {
                console.log(this.selectPage);
                console.log(widgetIndex);
                this.$set(this.fileData.widget[this.selectPage][widgetIndex], 'style', Object.assign({}, this.seatStyle));
                this.$refs['page' + this.selectPage][widgetIndex].resize();
            }
            this.isDragover = false;
            this.moveId = null;
            this.sizeId = null;
        },
        // 拖拽函数过程中
        dragover(e) {
            if(this.dragDomFuncInfo) {
                this.isDragover = true;
                let defaultWidth = this.dragDomFuncInfo.minSize ? this.dragDomFuncInfo.minSize.width : 100;
                let defaultHeight = this.dragDomFuncInfo.minSize ? this.dragDomFuncInfo.minSize.height : 100;
                this.seatStyle.left = parseInt(Math.max(e.offsetX - defaultWidth / 2, 10) / 10) * 10 + 'px';
                this.seatStyle.width = Math.ceil(defaultWidth / 10) * 10 + 'px';
                this.seatStyle.top = parseInt(Math.max(e.offsetY - defaultHeight / 2, 10) / 10) * 10 + 'px';
                this.seatStyle.height = Math.ceil(defaultHeight / 10) * 10 + 'px';
            }
        },
        addData() {
            this.isDragover = false;
            let dragDomFunc = this.dragDomFunc;
            prompt('请输入名称', dragDomFunc + '7').then((varName) => {
                if(varName !== null && varName !== '') {
                    varName = '$' + varName.replace(/^\$/, '');
                    // 创建变量
                    this.$emit('createVar', varName, dragDomFunc);
                    this.fileData.widget[this.selectPage].push({
                        data: varName,
                        style: cloneUtils.deep(this.seatStyle)
                    });
                }
            });
        }
    }
}
</script>
<style scoped lang="less">
    .widget-panel {
        position:absolute;
        border: solid 1px #bcbcbc;
        box-shadow: 0 0 8px -2px #d0d0d0;
        border-radius: 5px;
        box-sizing: border-box;

        .drag_tip {
            position: absolute;
            font-family: 'iconfont';
            display: none;
            z-index: 999999;
            font-size: 30px;
            border: solid 1px grey;
            background-color: #e7e7e7;
            border-radius: 2px;
            width: 30px;
            height: 30px;
            text-align: center;
            left: -31px;
            top: 0;
            cursor: move;

            &:hover {
                box-shadow: 0 0 8px -1px #a3a3a3;
            }
        }

        .drag_size {
            width: 0;
            height: 0;
            border-right: solid 10px black;
            border-top: solid 10px white;
            position: absolute;
            background: black;
            cursor: nwse-resize;
            right: 0;
            bottom: 0;
            display: none;

            &:hover {
                background: red;
            }
        }

        &:hover {
            .drag_tip {
                display: block;
            }

            .drag_size {
                display: block;
            }
        }

        .widget {
            display: inline-block;
            width: 100%;
            height: 100%;
            overflow: hidden;

            &.light {
                border: solid 1px red;
            }
        }
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

    .move_back {
        position: absolute;
        /*background-color: rgba(255, 0, 0, 0.24);*/
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .droging-seat {
        position: absolute;
        z-index: 9999999;
        min-width: 10px;
        min-height: 10px;
        background-color: rgba(75, 129, 148, 0.25);
        pointer-events: none;
        border: dashed 1px #4a6679;
        -webkit-box-shadow: 0 5px 5px 3px #bfbfbf;
        box-shadow: 0 5px 5px 0px #50505069;
        border-radius: 4px;
    }
</style>
