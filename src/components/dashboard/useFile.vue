<template>
    <div
        @dragover.self="dragover"
        @drop="ondrop"
        :style="{minWidth: appMinWidth + 'px'}"
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
        </div>
        <div v-if="moveId" class="move" @mousemove="mousemove" @mouseup="mouseup"
             style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>
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
            appMinWidth: 0,
            dragPos: '',
            moveId: null
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
            // console.log(item);
            this.appMinWidth = Math.max(parseInt(item.left) + 500, this.appMinWidth);
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
        },
        mousemove(e) {
            let widget = this.fileData.widget.find(item => {
                return item.id === this.moveId;
            });
            if(widget) {
                this.$set(widget, 'style', Object.assign({}, widget.style, {
                    left: e.offsetX + 'px',
                    top: e.offsetY + 'px'
                }));
            }
        },
        mouseup() {
            this.moveId = null;
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
        &:hover {
            .drag_tip {
                display: block;
            }
        }
        .widget {
            border: solid 1px #404040;
            border-radius: 2px;
            display: inline-block;
            &.light {
                border: solid 1px red;
            }
        }
    }
</style>