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

class BAR extends FuncObj {
    constructor(source, table, x, y) {
        super(...Array.from(arguments));
        this.name = 'BAR';
        this.dom = document.createElement('div');
        this.myChart = echarts.init(this.dom);
        this.selectBar = -1;
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
        if (model instanceof Var) {
            model = model.value_;
        }
        if (model === '') {
            handle(false);
            return;
        }
        let data = model.value;
        let option = {
            tooltip: {},
            legend: {
                data: model.dataColumn
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: []
        };
        option.xAxis.data = [];
        option.series = [];
        if (data.length > 0) {
            data.forEach((item) => {
                item.forEach((item2, key) => {
                    if (key < model.groupColumn.length) {
                        option.xAxis.data.push(item2);
                    } else {
                        let thisOne = key - model.groupColumn.length;
                        if (option.series[thisOne] === undefined) {
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
                                            let index = option.xAxis.data.indexOf(self.selectBar);
                                            if (index === -1) {
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
                                name: model.dataColumn[thisOne],
                                selectedMode: 'single',
                                data: []
                            };
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
    match: /^BAR/,
    type: 'function',
    name: 'BAR',
    title: '柱状图',
    func: BAR,
    props: [
        {
            name: 'source:',
            title: '关系模型',
            dataType: 'relationalModel'
        }
    ]
});
