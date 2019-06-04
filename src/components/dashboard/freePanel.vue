<template>
    <div @drop="addData"
         @dragover="$event.preventDefault()"
         style="position: relative;height: 100%;overflow: auto;width: 100%;"
    >
        <div
            v-if="drag"
            @mousemove.self="mousemove"
            @mouseup="drag=false"
            @mouseleave="drag=false"
            style="position:absolute;top:0;left:0;width: 100%;height:100%;background-color: rgba(255,0,0,0);z-index: 2;"></div>
        <div
            style="position:absolute;top:0;left:0;height: 100%;overflow: auto;width: 100%;z-index: 1;">
            <template v-for="(item,index) in data">
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
            data: []
        };
    },
    methods: {
        mousedown(index) {
            this.dragObjIndex = index;
            this.drag = true;
            console.log(1);
        },
        mousemove(e) {
            if(this.drag) {
                this.data[this.dragObjIndex].style.x = e.offsetX;
                this.data[this.dragObjIndex].style.y = e.offsetY;
            }
        },
        addData(e) {
            console.log(e);
            let randomId = 'r' + parseInt(Math.random() * 1000000);
            let varName = window.prompt('请输入名称', 'a7');
            if(varName !== null) {
                varName = '$' + varName.replace(/^\$/, '');
                this.data.push({
                    data: varName,
                    randomId: randomId,
                    style: {
                        x: e.offsetX,
                        y: e.offsetY
                    }
                });
                if(varName !== null) {
                    this.$nextTick(() => {
                        widgetEvent.emit('change', varName);
                    });
                }
            }
        }
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
</style>