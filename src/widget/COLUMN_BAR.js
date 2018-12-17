/**
 * Created by ptmind on 2018/3/9.
 */
import echarts from 'echarts';
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import Var from '../observer/Var';
import Dict from '../languageParser/dictionary';
class Temp extends Obj {
    get value() {
        return this.value_;
    }

    set value(varObj) {
        this.dep.lock();
        this.value_ = varObj;
        this.dep.update();
    }
}
// &#xeb62;
class COLUMN_BAR extends FuncObj {
    constructor(source, table, x, y, where) {
        super(...Array.from(arguments));
        this.name = 'COLUMN_BAR';
        this.dom = document.createElement('div');
        this.myChart = echarts.init(this.dom);
        this.selectBar = -1;
        this.isStack = false;
        let xColumn = new Temp();
        let select = new Temp();
        let value = new Temp();
        this.dict = new Dict({
            x: xColumn,
            select: select,
            value: value
        });
        this.myChart.on('click', (params) => {
            this.selectBar = params.name;
            xColumn.value = params.name;
            select.value = params.seriesName;
            value.value = parseFloat(params.data);
            this.dep.update();
        });
    }

    get value() {
        return this.dict.value;
    }

    render(handle) {
        let self = this;
        let model = this.props[0];
        if(model instanceof Var) {
            model = model.value_;
        }
        if(model === '') {
            handle(false);
            return;
        }
        let data = model.value.dataValue;
        let option = {
            tooltip: {},
            legend: {
                data: model.value.dataColumn
            },
            xAxis: {
                type: 'value',
                data: []
            },
            yAxis: {
                type: 'category'
            },
            series: []
        };
        console.log(option);
        option.yAxis.data = [];
        option.series = [];
        if(data.length > 0) {
            data.forEach((item) => {
                item.forEach((item2, key) => {
                    if(key < model.value.groupColumn.length) {
                        option.yAxis.data.push(item2);
                    } else {
                        let thisOne = key - model.value.groupColumn.length;
                        if(option.series[thisOne] === undefined) {
                            option.series[thisOne] = {
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            let colorList = Array(data.length);
                                            let allColor = [
                                                '#c03736', '#304553', '#63a0a7', '#d28268', '#93c6af',
                                                '#759e84', '#c9852f', '#bca29b', '#6e7074', '#55656f',
                                                '#c4ccd3'
                                            ];
                                            let baseColor = allColor[params.seriesIndex % allColor.length];
                                            colorList.fill(baseColor);
                                            let index = option.yAxis.data.indexOf(self.selectBar);
                                            if(index === -1) {
                                                return baseColor;
                                            }
                                            colorList[index] = '#e2633b';
                                            return colorList[params.dataIndex];
                                        },
                                        label: {
                                            show: true,
                                            position: 'top'
                                        }
                                    }
                                },
                                name: model.value.dataColumn[thisOne],
                                selectedMode: 'single',
                                data: []
                            };
                            if(this.isStack) {
                                option.series[thisOne].stack = 'one';
                            }
                        }
                        option.series[thisOne].data.push(item2);
                    }
                });
            });
        }
        this.myChart.setOption(option, true);
        setTimeout(() => {
            this.dom.style.width = '500px';
            this.dom.style.height = '300px';
            this.myChart.resize();
        }, 0);
    }
}
__allMatch__.push({
    match: /^COLUMN_BAR/,
    type: 'function',
    name: 'COLUMN_BAR',
    title: '条形图',
    func: COLUMN_BAR,
    props: [{
        name: 'source',
        title: '关系模型',
        dataType: 'var,relationalModel'
    }],
    returnType: 'dom'
});

class STACK_COLUMN_BAR extends COLUMN_BAR {
    constructor(source, table, x, y, where) {
        super(...Array.from(arguments));
        this.name = 'STACK_COLUMN_BAR';
        this.isStack = true;
    }
}
__allMatch__.push({
    match: /^STACK_COLUMN_BAR/,
    type: 'function',
    name: 'STACK_COLUMN_BAR',
    title: '堆叠条形图',
    func: STACK_COLUMN_BAR,
    props: [{
        name: 'source',
        title: '关系模型',
        dataType: 'var,relationalModel'
    }],
    returnType: 'dom'
});
