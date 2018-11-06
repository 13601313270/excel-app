<template>
    <div
        @dragover.self="dragover"
        @drop="ondrop"
    >
        <div>文件保存</div>
        <div :style="style" v-show="dragDomFunc" class="droging-seat"></div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <widget data="$bbb"></widget>
        <div v-for="(item,key) in fileData.widget" :style="getStyle(item.style)">
            <widget :key="item.id" class="widget" :class="{light:dragDomFunc}"></widget>
            <!--<div @click="deleteWidget(key)" class="delete_button" v-if="isEditing">delete</div>-->
        </div>
        <!--<button @click="add" v-if="isEditing">click</button>-->
    </div>
</template>
<script>
import cloneUtils from '../clone.utils';
export default {
    props: ['fileData', 'isEditing', 'dragDomFunc'],
    data() {
        return {
            style: {
                left: 0,
                top: 0
            },
            dragPos: ''
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
            return Object.assign({
                position: 'absolute'
            }, item);
        },
        deleteWidget(key) {
            this.fileData.widget.splice(key, 1);
        },
        dragover(e) {
            this.style.left = (e.offsetX - 50) + 'px';
            this.style.top = (e.offsetY - 50) + 'px';
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
        }
    }
}
</script>
<style scoped lang="less">
    .droging-seat {
        position: absolute;
        width: 100px;
        height: 100px;
        background-color: rgba(255, 0, 0, 0.41);
        pointer-events: none
    }

    .widget {
        border: solid 1px black;
        &.light {
            border: solid 1px red;
        }
    }

    .delete_button {
        width: 40px;
    }
</style>