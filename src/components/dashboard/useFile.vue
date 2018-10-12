<template>
    <div>
        <div>文件保存</div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <widget data="$bbb"></widget>
        <div v-for="(item,key) in fileData.widget">
            <widget :key="item" class="widget" :class="{light:dragDomFunc}"></widget>
            <div @click="deleteWidget(key)" class="delete_button" v-if="isEditing">delete</div>
        </div>
        <button @click="add" v-if="isEditing">click</button>
    </div>
</template>
<script>
export default {
    props: ['fileData', 'isEditing', 'dragDomFunc'],
    created() {
        if(this.fileData.widget === undefined) {
            this.$set(this.fileData, 'widget', []);
        }
        this.$emit('eval', `$a111 = INPUT('string',"10")
        $bbb = INPUT('number',100)`);
    },
    methods: {
        add() {
            let widgetKey = 'widget_' + parseInt(Math.random() * 100000);
            this.fileData.widget.push(widgetKey);
        },
        deleteWidget(key) {
            this.fileData.widget.splice(key, 1);
        }
    }
}
</script>
<style scoped lang="less">
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