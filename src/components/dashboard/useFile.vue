<template>
    <div
        @dragover.self="dragover"
        @drop="ondrop"
        :style="{width: (appMinWidth+20) + 'px',height: (appMinHeight+20) + 'px'}"
    >
        <div>文件保存</div>
        <div :style="style" v-show="dragDomFunc" class="droging-seat"></div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <widget data="$bbb" style="margin-left: 10px;"></widget>
        <div class="widget_content" v-for="(item,key) in fileData.widget" :style="getStyle(item.style)">
            <div class="drag_tip" v-if="isEditing" @mousedown="moveStart(item.id)">&#xe656;</div>
            <widget
                :key="item.id"
                :item="item"
                class="widget"
                :class="{light:dragDomFunc}"
            ></widget>
            <div class="drag_size" v-if="isEditing" @mousedown="sizeId = item.id"></div>
        </div>
        <div v-if="moveId || sizeId" class="move" @mousemove="mousemove" @mouseup="mouseup"></div>
    </div>
</template>
<script>
import cloneUtils from '../clone.utils';
export default {
    props: ['fileData', 'isEditing', 'dragDomFunc', 'dragDomFuncInfo', 'isFullScreen'],
    data() {
        return {
            style: {
                left: 0,
                top: 0
            },
            appMinWidth: 200,
            appMinHeight: 200,
            dragPos: '',
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
    },
    methods: {
        getStyle(item) {
            this.appMinWidth = Math.max(parseInt(item.left) + parseInt(item.width), this.appMinWidth);
            this.appMinHeight = Math.max(parseInt(item.top) + parseInt(item.height), this.appMinHeight);
            return Object.assign({
                position: 'absolute'
            }, item);
        },
        deleteWidget(key) {
            this.fileData.widget.splice(key, 1);
        },
        dragover(e) {
            this.style.left = (e.offsetX) + 'px';
            this.style.top = (e.offsetY) + 'px';
            if(this.dragDomFuncInfo && this.dragDomFuncInfo.defaultSize && this.dragDomFuncInfo.defaultSize.width && this.dragDomFuncInfo.defaultSize.height) {
                this.style.left = (e.offsetX - this.dragDomFuncInfo.defaultSize.width / 2) + 'px';
                this.style.top = (e.offsetY - this.dragDomFuncInfo.defaultSize.height / 2) + 'px';
                this.style.width = this.dragDomFuncInfo.defaultSize.width + 'px';
                this.style.height = this.dragDomFuncInfo.defaultSize.height + 'px';
            } else {
                this.style.left = (e.offsetX - 50) + 'px';
                this.style.top = (e.offsetY - 50) + 'px';
                this.style.width = '100px';
                this.style.height = '100px';
            }
            e.preventDefault();
        },
        ondrop() {
            let widgetKey = 'widget_' + parseInt(Math.random() * 100000);
            this.fileData.widget.push({
                id: widgetKey,
                style: cloneUtils.deep(this.style)
            });
            this.$nextTick(() => {
                this.$emit('addWidgetContent', widgetKey);
            });
        },
        moveStart(id) {
            this.moveId = id;
            let allStyle = this.fileData.widget.map(item => {
                return item.style;
            });
            console.log(allStyle);
        },
        mousemove(e) {
            if (this.moveId !== null) {
                let widget = this.fileData.widget.find(item => {
                    return item.id === this.moveId;
                });
                if(widget) {
                    this.$set(widget, 'style', Object.assign({}, widget.style, {
                        left: parseInt(e.offsetX / 10) * 10 + 'px',
                        top: parseInt(e.offsetY / 10) * 10 + 'px'
                    }));
                }
            } else if (this.sizeId !== null) {
                let widget = this.fileData.widget.find(item => {
                    return item.id === this.sizeId;
                });
                if(widget) {
                    this.$set(widget, 'style', Object.assign({}, widget.style, {
                        width: parseInt(e.offsetX / 10) * 10 - parseInt(widget.style.left) + 'px',
                        height: parseInt(e.offsetY / 10) * 10 - parseInt(widget.style.top) + 'px'
                    }));
                }
            }
        },
        mouseup() {
            this.moveId = null;
            this.sizeId = null;
        }
    }
}
</script>
<style scoped lang="less">
    .droging-seat {
        position: absolute;
        z-index: 9999999;
        min-width: 100px;
        min-height: 100px;
        background-color: rgba(255, 0, 0, 0.41);
        pointer-events: none
    }

    .widget_content {
        position: relative;
        border: solid 1px #404040;
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
    .move {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>