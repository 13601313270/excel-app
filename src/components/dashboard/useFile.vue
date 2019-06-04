<template>
    <div
        @dragover.prevent.self="dragover"
        @drop="ondrop"
        @dragleave="isDragover = false"
        :style="{width: (appMinWidth+20) + 'px',height: (appMinHeight+20) + 'px'}"
    >
        <div>文件保存</div>
        <div :style="seatStyle" v-show="isDragover" class="droging-seat"></div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <widget data="$bbb" style="margin-left: 10px;"></widget>
        <div class="widget_content" v-for="(item) in fileData.widget" :style="item.style">
            <div class="drag_tip" v-if="isEditing" @mousedown.prevent="moveId = item.id">&#xe656;</div>
            <widget
                :key="item.id"
                :data="item.data"
                :item="item"
                class="widget"
                :class="{light:dragDomFunc}"
            ></widget>
            <div class="drag_size" v-if="isEditing" @mousedown="sizeId = item.id"></div>
        </div>
        <div v-if="moveId || sizeId" class="move_back" @mousemove="mousemove" @mouseup="mouseup"></div>
    </div>
</template>
<script>
import cloneUtils from '../clone.utils';
export default {
    props: ['fileData', 'isEditing', 'dragDomFunc', 'dragDomFuncInfo', 'isFullScreen'],
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
            appMinWidth: 200,
            appMinHeight: 200,
            moveId: null,
            sizeId: null
        }
    },
    created() {
        if(this.fileData.widget === undefined) {
            this.$set(this.fileData, 'widget', []);
        }
        this.$emit('eval', `$a111 = INPUT('string',"10")
        $bbb = INPUT('number',100)`);
        this.initDashboardSize();
    },
    methods: {
        // 拖拽函数过程中
        dragover(e) {
            if (this.dragDomFuncInfo) {
                this.isDragover = true;
                let defaultWidth = this.dragDomFuncInfo.defaultSize ? this.dragDomFuncInfo.defaultSize.width : 100;
                let defaultHeight = this.dragDomFuncInfo.defaultSize ? this.dragDomFuncInfo.defaultSize.height : 100;
                this.seatStyle.left = parseInt(Math.max(e.offsetX - defaultWidth / 2, 10) / 10) * 10 + 'px';
                this.seatStyle.width = parseInt(defaultWidth / 10) * 10 + 'px';
                this.seatStyle.top = parseInt(Math.max(e.offsetY - defaultHeight / 2, 10) / 10) * 10 + 'px';
                this.seatStyle.height = parseInt(defaultHeight / 10) * 10 + 'px';
            }
        },
        // 拖拽函数松鼠标
        ondrop() {
            this.isDragover = false;
            let widgetKey = 'widget_' + parseInt(Math.random() * 100000);
            this.fileData.widget.push({
                id: widgetKey,
                style: cloneUtils.deep(this.seatStyle)
            });
            this.$nextTick(() => {
                // 出发填充widget内容事件
                this.$emit('addWidgetContent', widgetKey);
            });
        },
        // 拖拽widge尺寸或大小
        mousemove(e) {
            let widget = this.fileData.widget.find(item => {
                return item.id === (this.moveId || this.sizeId);
            });
            this.isDragover = true;
            if (this.moveId !== null) {
                this.seatStyle.left = parseInt(Math.max(e.offsetX, 10) / 10) * 10 + 'px';
                this.seatStyle.width = parseInt(parseInt(widget.style.width) / 10) * 10 + 'px';
                this.seatStyle.top = parseInt(Math.max(e.offsetY, 10) / 10) * 10 + 'px';
                this.seatStyle.height = parseInt(parseInt(widget.style.height) / 10) * 10 + 'px';
            } else if (this.sizeId !== null) {
                this.seatStyle.left = widget.style.left;
                this.seatStyle.width = parseInt(e.offsetX / 10) * 10 - parseInt(widget.style.left) + 'px';
                this.seatStyle.top = widget.style.top;
                this.seatStyle.height = parseInt(e.offsetY / 10) * 10 - parseInt(widget.style.top) + 'px';
            }
            this.initDashboardSize();
        },
        // 拖拽widge尺寸或大小结束
        mouseup() {
            let widget = this.fileData.widget.find(item => {
                return item.id === (this.moveId || this.sizeId);
            });
            if (widget) {
                this.$set(widget, 'style', Object.assign({}, this.seatStyle));
            }
            this.isDragover = false;
            this.moveId = null;
            this.sizeId = null;
        },
        // 重新计算dashboard大小
        initDashboardSize() {
            let maxWidth = 0;
            let maxHeight = 0;

            function getItemSize(item) {
                return [parseInt(item.style.left) + parseInt(item.style.width), parseInt(item.style.top) + parseInt(item.style.height)];
            }

            this.fileData.widget.forEach(item => {
                let temp = getItemSize(item);
                maxWidth = Math.max(temp[0], maxWidth);
                maxHeight = Math.max(temp[1], maxHeight);
            });
            maxWidth = Math.max(parseInt(this.seatStyle.left) + parseInt(this.seatStyle.width), maxWidth);
            maxHeight = Math.max(parseInt(this.seatStyle.top) + parseInt(this.seatStyle.height), maxHeight);
            this.appMinWidth = maxWidth;
            this.appMinHeight = maxHeight;
        }
    }
}
</script>
<style scoped lang="less">
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

    .widget_content {
        position: absolute;
        border: solid 1px #5d5d5d;
        box-shadow: 0 0 8px -2px #d0d0d0;
        border-radius: 5px;
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
    .move_back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>