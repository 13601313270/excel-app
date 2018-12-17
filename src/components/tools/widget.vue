<template>
    <div class="widgets">
        <div v-for="item in widgetList">
            <h2 v-html="item.title"></h2>
            <div class="item">
                <div class="widget_item" v-for="widgetItem in item.list" draggable="true"
                     @dragstart='drag(widgetItem.type)'>
                    <div class="icon" v-html="widgetItem.icon"></div>
                    <div class="name" v-html="widgetItem.name"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'widgetTypeList',
    props: ['data', 'randomId'],
    data() {
        return {
            widgetList: [
                {
                    title: '表单',
                    list: [
                        {
                            type: 'INPUT',
                            name: '输入框',
                            icon: '&#xe692;'
                        },
                        {
                            type: 'INPUT_DATE',
                            name: '日期',
                            icon: '&#xe602;'
                        },
                        {
                            type: 'CHECK_BOX',
                            name: '开关器',
                            icon: '&#xe72c;'
                        }
                    ]
                }, {
                    title: '图表',
                    list: [
                        {
                            type: 'BAR',
                            name: '柱状图',
                            icon: '&#xe600;'
                        },
                        {
                            type: 'STACK_BAR',
                            name: '堆积柱状图',
                            icon: '&#xe603;'
                        },
                        {
                            type: 'COLUMN_BAR',
                            name: '条形图',
                            icon: '&#xeb62;'
                        },
                        {
                            type: 'STACK_COLUMN_BAR',
                            name: '堆叠条形图',
                            icon: '&#xe816;'
                        },
                        {
                            type: 'LINE',
                            name: '折线图',
                            icon: '&#xe636;'
                        },
                        {
                            type: 'PIE',
                            name: '饼状图',
                            icon: '&#xe60c;'
                        }
                    ]
                }, {
                    title: '计算',
                    list: [
                        {
                            type: 'MIN',
                            name: '最小值',
                            icon: '&#xe680;'
                        }, {
                            type: 'IF',
                            name: 'IF判断',
                            icon: '&#xe680;'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        drag(type) {
            this.$emit('drag', type);
        }
    }
}
</script>
<style scoped lang="less">
    @import "../ui/basic";

    .widgets {
        > div {
            &:first-child {
                h2 {
                    border-top: none;
                }
            }
            h2 {
                width: 80%;
                clear: both;
                border-top: solid 1px rgba(255, 255, 255, 0.1);
                margin: 18px 10% 10px 10%;
            }
            .item {
                .widget_item {
                    .ui_panel;
                    font-family: iconfont;
                    padding: 5px 15px;
                    background-color: rgba(255, 255, 255, 0.92);
                    width: 85px;
                    height: 56px;
                    margin-left: 10px;
                    margin-bottom: 10px;
                    float: left;
                    cursor: move;
                    &:hover {
                        box-shadow: 0 0 12px -2px #f0f0f0;
                        color: #484848;
                        // background-color: rgba(255, 255, 255, 0.92);
                    }
                    .icon {
                        font-size: 25px;
                    }
                    .name {
                        font-size: 12px;
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    clear: both;
                }
            }
        }
    }
</style>