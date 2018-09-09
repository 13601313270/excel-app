<template>
    <div>
        <div>文件保存</div>
        <div></div>
        <!--<widget saveId="sf"></widget>-->
        <widget data="$bbb"></widget>
        <div v-for="(item,key) in fileData.widget">
            <widget :key="item" class="widget" :class="{light:dragDomFunc}"></widget>
            <div @click="deleteWidget(key)" v-if="isEditing">delete</div>
        </div>
        <div @click="add" v-if="isEditing">click</div>
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
        $a3 = BAR(RELATIONAL_MODEL(1,'excel','DATE_FORMAT(ctime,"%Y-%m")',['count(id)','count(id)+4']))
        $a411 = $a3.select
        $bbb = INPUT('number',100)
        $a511 = MIN($a1,1)`);
    },
    methods: {
        add() {
            let widgetKey = 'widget_' + parseInt(Math.random() * 100000);
            this.fileData.widget.push(widgetKey);
            this.$emit('save');
        },
        deleteWidget(key) {
            this.fileData.widget.splice(key, 1);
            this.$emit('save');
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
</style>