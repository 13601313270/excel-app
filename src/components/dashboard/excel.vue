<template>
    <div style="position: relative;height: 100%;overflow: auto;width: 100%;">
        <div class="tableThead">
            <table class="table" :style="{marginLeft:theadLeft*-1+'px'}">
                <thead>
                <tr>
                    <th v-for="i in tableObj.lie" class="lieNum"
                        :lienum="getCellTemp2(0, i).match(/([A-Z]*)(\d+)/)[1]">
                        {{getCellTemp2(0, i).match(/([A-Z]*)(\d+)/)[1]}}
                        <!--<absolute-move @mousemove="Xmousemove" @mouseup="Xmouseup" move="x"></absolute-move>-->
                    </th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="tableRow">
            <table class="table" :style="{marginTop:rowTop*-1+'px'}">
                <tbody>
                <tr v-for="i in tableObj.hang">
                    <td class="idNum" :hang="i" style="width: 80px;">{{i}}
                        <!--<absolute-move @mousemove="Ymousemove" @mouseup="Ymouseup" move="y"></absolute-move>-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="tableBody" @scroll="scroll($event)">
            <!--<div class="allCharts" ref="allCharts">-->
            <!--<absolute-move-->
            <!--:key="key"-->
            <!--:move="edit?'both':'none'"-->
            <!--@mouseup="moveCharts"-->
            <!--v-for="item,key in this.alltableObj"-->
            <!--:left="item.left"-->
            <!--:top="item.top"></absolute-move>-->
            <!--</div>-->
            <table class="table">
                <thead>
                <tr>
                    <th v-for="i in tableObj.lie" class="lienum"
                        :lienum="getCellTemp2(0, i).match(/([A-Z]*)(\d+)/)[1]"></th>
                </tr>
                </thead>
                <tbody ref="tableBody">
                <tr v-for="i in tableObj.hang" :hang="i">
                    <td v-for="j in tableObj.lie"
                        @click.stop="selectTd_temp(i,j)"
                        @dblclick.stop="dbselectTd_temp(i,j,$event)"
                        :key="(i)+','+(j)"
                        :hang="i"
                        :lie="j"
                        :class="setSelectClass(i,j)"
                        @mousedown="mousedown_temp(i,j)"
                        @mouseover="mouseenter_temp(i,j)"
                        @mouseup="mouseup_temp"
                    >
                        <widget
                            v-if="hasWidget(i,j)"
                            :data="hasWidget(i,j).data"
                            :random-id="hasWidget(i,j).randomId"
                            :ref="'$' + getCellTemp2(i, j)"></widget>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import widget from '../widget.vue';
import widgetEvent from '../widgetChange';
import ajax from '../../api/ajax';
function getCellTemp(str) {
    try {
        str = str.match(/([A-Z]*)\$?(\d+)/);
        let tdStr = str[1];
        let trNum = parseInt(str[2]);
        let tdNum = 0;
        for (let i = 0; i < tdStr.length; i++) {
            tdNum += (tdStr[i].charCodeAt() - 64) * Math.pow(26, tdStr.length - i - 1);
        }
        return [trNum, tdNum];
    } catch (e) {
        return null;
    }
}

function getCellTemp2(trNum, tdNum) {
    let result = '';
    do {
        let append = String.fromCharCode(tdNum % 26 + 64);
        if(append === '@') {
            append = 'Z';
            tdNum -= 26;
        }
        result = append + '' + result;
        tdNum = parseInt(tdNum / 26);
    } while (tdNum > 0);
    return result + trNum;
}
export default {
    props: ['dragDomFunc'],
    data() {
        return {
            tableObj: {
                lie: 5,
                hang: 5,
                alltableObj: [],
                tdList: [[1, 2]]
            },
            theadLeft: 0,
            rowTop: 0,
            isSelectDoms: false,
            beginSelect: [],
            // 用于记录最后一次触发的坐标
            lastEnterTd: [],
            // 用于记录选择区间
            poiCenter: {
                top: 2,
                bottom: 1,
                left: 2,
                right: 1
            },
            data: []
        };
    },
    mounted() {
        let self = this;
        ajax({
            type: 'POST',
            url: 'http://www.tablehub.cn/action/table.html',
            data: {
                'function': 'tableInfo',
                fileId: 36,
                temp: 1
            }
        }).then((data) => {
            console.log(data.data[0].tableValue);
            for (let key in data.data[0].tableValue) {
                let randomId = 'r' + parseInt(Math.random() * 1000000);
                let varName = '$' + key;
                let pos = getCellTemp(key);
                if(pos[1] >= self.tableObj.lie) {
                    self.tableObj.lie = pos[1];
                }
                if(pos[0] >= self.tableObj.hang) {
                    self.tableObj.hang = pos[0];
                }
                let code = data.data[0].tableValue[key].value.toString();// 'INPUT("number",999)';
                if(code.indexOf('=') === 0) {
                    code = code.substr(1);
                } else {
                    code = 'TEXT("' + code + '")';
                }
                this.data.push({
                    type: 'widget',
                    data: varName,
                    randomId: randomId,
                    code: code
                });
                this.$nextTick(() => {
                    this.data.forEach(item => {
                        widgetEvent.emit('insertByCode', item.data, item.randomId, this.$refs[item.data][0].$refs.content, item.code);
                    });
                });
            }
            console.log(data.data[0]);
        });
    },
    methods: {
        hasWidget(hang, lie) {
            return this.data.find(item => {
                return item.data === '$' + getCellTemp2(hang, lie);
            });
        },
        selectTd_temp() {
        },
        dbselectTd_temp(hang, lie) {
            let randomId = 'r' + parseInt(Math.random() * 1000000);
            let varName = '$' + getCellTemp2(hang, lie);
            if(this.data.find(item => { return item.data === varName; })) {
                widgetEvent.emit('editVar', varName);
            } else {
                this.data.push({
                    type: 'widget',
                    data: varName,
                    randomId: randomId
                });
                if(varName !== null) {
                    this.$nextTick(() => {
                        console.log(this.$refs[varName][0].$refs.content);
                        widgetEvent.emit('change', varName, randomId, this.$refs[varName][0].$refs.content);
                    });
                }
            }
        },
        setSelectClass() {
        },
        mousedown_temp(hang, lie) {
            if(this.edit) {
                this.beginSelect = [hang, lie];
                this.isSelectDoms = true;
                event.preventDefault();
            }
        },
        mouseenter_temp(hang, lie) {
            if(this.isSelectDoms) {
                // 防止重复出发
                if(this.lastEnterTd[0] === hang && this.lastEnterTd[1] === lie) {
                    return;
                }
                this.lastEnterTd = [hang, lie];
                var top = Math.min(hang, this.beginSelect[0]);
                var bottom = Math.max(hang, this.beginSelect[0]);
                var left = Math.min(lie, this.beginSelect[1]);
                var right = Math.max(lie, this.beginSelect[1]);
                this.poiCenter = {
                    top: top,
                    bottom: bottom,
                    left: left,
                    right: right
                };
                this.tableObj.events_.emit('tdSelect', {
                    pos: getCellTemp2(hang, lie),
                    xf: this.selectTd(),
                    selectMergeState: 'up'
                });
            }
        },
        mouseup_temp() {
            this.isSelectDoms = false;
        },
        scroll(event) {
            this.theadLeft = event.target.scrollLeft;
            this.rowTop = event.target.scrollTop;
//            this.tableObj.events_.emit('scroll', {
//                x: this.theadLeft,
//                y: this.rowTop,
//            });
        },
        getCellTemp2: getCellTemp2
    },
    components: {
        widget
    }
}
</script>
<style scoped lang="less">
    .floatSingleValueWrite {
        height: 1px;
        width: 1px;
        position: absolute;
        margin-top: 41px;
        .input {
            position: absolute;
            z-index: 2;
            background-color: rgb(255, 255, 255);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.63);
        }
        input {
            width: 100%;
            height: 100%;
            &:focus {
                outline: none;
            }
        }
        .span {
            opacity: 0;
        }
    }

    body {
        background-color: #e6e6e6;
    }

    .table {
        width: 0 !important;
        border-spacing: 0;
        border-collapse: collapse;
        margin-top: 0;
        background-color: white;
        table-layout: fixed;
        > thead > tr > th {
            width: 100px;
        }

        > tbody > tr > td {
            width: 100px;
            overflow: hidden;
        }
        th, td {
            text-align: center;
        }

        > tbody > tr {
            height: 37px;
            > td {
                min-width: 60px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                white-space: nowrap;
                vertical-align: middle;
                padding: 0;
                height: 37px;
            }
            > .mergeTd {
                white-space: initial
            }
        }

        > thead {
            background-color: #c3c3c3;
        }

        td .tdInsertDiv {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: stretch;
            > div:nth-child(2) {
                flex-grow: 1;
                > span {
                    display: inline-block;
                }
            }
        }
    }

    .idNum {
        background-color: #c3c3c3;
        border-right: solid 3px #929292;
        min-width: 30px;
    }

    .tableBody {
        margin-left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        margin-top: 0;
        .input-group {
            width: 98%;
            margin-left: 1%;
        }
        .allCharts {
            height: 1px;
            width: 1px;
            position: relative;
        }
    }

    .tableRow {
        position: absolute;
        left: 0;
        width: 80px;
        top: 37px;
        height: calc(~"100% - 39px");
        overflow: hidden;
    }

    .table {
        margin: 0 0;
    }

    .tableRow {
        display: block;
        .table > tbody > tr > .idNum {
            position: relative;
            > div {
                cursor: ns-resize;
                position: absolute;
                left: 0;
                bottom: 0;
                height: 5px;
                width: 100%;
            }
        }
    }

    .tableBody {
        margin-left: 80px;
        width: calc(~"100% - 80px");
        height: calc(~"100% - 39px");
        overflow: scroll;
        margin-top: 39px;
        cursor: cell;
    }

    .editTd {
        background-color: #e5f2ff;
        /*border:solid 2px #0000b8;*/
    }

    .editTdtop {
        border-top: solid 2px #0000b8;
    }

    .editTdbottom {
        border-bottom: solid 2px #0000b8;
    }

    .editTdleft {
        border-left: solid 2px #0000b8;
    }

    .editTdright {
        border-right: solid 2px #0000b8;
    }

    #myTabContent {
        position: relative;
        height: calc(~"100% - 40px");
        .tab-pane {
            overflow: auto;
            width: 100%;
            height: 100%;
            padding-top: 5px;
        }
    }

    .edit #myTabContentParent .tab-pane {
        padding-top: 1px;
    }

    #myTabContentParent {
        position: fixed;
        top: 45px;
        left: 0;
        right: 0;
        bottom: 20px;
    }

    .edit #myTabContentParent {
        top: 90px;
    }

    .trMain {
        background-color: white;
    }

    .trTwo {
        display: none;
        background-color: #eeeeee;
    }

    .trThree {
        background-color: #e8e8e8;
    }

    .addButton {
        float: right;
    }

    .addButton:after {
        content: '+';
    }

    .tableThead thead > tr > th {
        box-sizing: border-box;
        min-width: 60px;
        border: 1px solid #ddd;
        white-space: nowrap;
        vertical-align: middle;
        padding: 0;
        height: 37px;
    }

    .tableThead {
        position: absolute;
        left: 80px;
        width: calc(~"100% - 80px");
        overflow: hidden;
        > thead th {
            border-bottom: solid 3px #929292 !important;
        }
        .table > thead > tr > .lieNum {
            position: relative;
            > div {
                cursor: ew-resize;
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                width: 5px;
            }
        }
    }

    .tableBody {
        tr {
            background-color: white;
        }

        thead {
            height: 20px;
        }

        thead [lienum] {
            padding: 0;
        }

        .table {
            margin-top: -2px;
        }

        .table > thead > tr > th {
            border-bottom: none;
        }
    }

    .styleAllSelect {
        float: left;
        width: 60px;
        height: 20px;
        margin: 2px;
        background-color: white;
    }

    .styleSelect {
        border: solid 1px black;
    }

    .idNumOn {
        background-color: #a7a7a7 !important;
        box-shadow: inset 6px -1px 20px 1px #909090;
        color: #e8e8e8;
    }

    .lieNumOn {
        background-color: #a7a7a7 !important;
        box-shadow: inset 0px 6px 20px 3px #909090;
        color: #e8e8e8;
    }

    .addTable {
        font-family: iconfont;
        line-height: 40px;
        border: solid 1px rgba(255, 255, 255, 0);
        border-left: solid 1px #bdbdbd;
        width: 50px;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
    }

    .addTable:hover {
        background-color: #e6e6e6;
        border: solid 1px #b5b5b5;
        border-radius: 2px;
    }
</style>