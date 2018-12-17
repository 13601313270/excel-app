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

class PIE extends FuncObj {
    constructor(source, table, x, y, where) {
        super(...Array.from(arguments));
        this.name = 'PIE';
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
            series: []
        };
        option.series = [];
        if(data.length > 0) {
            data.forEach((item, dataNum) => {
                item.forEach((item2, key) => {
                    if(key < model.value.groupColumn.length) {
                    } else {
                        let thisOne = key - model.value.groupColumn.length;
                        if(option.series[thisOne] === undefined) {
                            let radius = [0, '30%'];
                            if(item.length - model.value.groupColumn.length === 1) {
                                radius = [0, '80%'];
                            }
                            if(key > 1) {
                                radius = ['40%', '55%'];
                            }
                            console.log('------');
                            console.log(key);
                            option.series[thisOne] = {
                                type: 'pie',
                                radius: radius,
                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
                                // itemStyle: {
                                //     normal: {
                                //         color: function(params) {
                                //             let colorList = Array(data.length);
                                //             let allColor = [
                                //                 '#c03736', '#304553', '#63a0a7', '#d28268', '#93c6af',
                                //                 '#759e84', '#c9852f', '#bca29b', '#6e7074', '#55656f',
                                //                 '#c4ccd3'
                                //             ];
                                //             let baseColor = allColor[params.seriesIndex % allColor.length];
                                //             colorList.fill(baseColor);
                                //             return colorList[params.dataIndex];
                                //         },
                                //         label: {
                                //             show: true,
                                //             position: 'top'
                                //         }
                                //     }
                                // },
                                name: model.value.dataColumn[thisOne],
                                selectedMode: 'single',
                                data: []
                            };
                        }
                        option.series[thisOne].data.push({
                            value: item2,
                            name: item[0]
                        });
                    }
                });
            });
        }
        // console.log('------');
        // console.log(option);
        this.myChart.setOption(option, true);
        setTimeout(() => {
            this.dom.style.width = '500px';
            this.dom.style.height = '300px';
            this.myChart.resize();
        }, 0);
    }
}
__allMatch__.push({
    match: /^PIE/,
    type: 'function',
    name: 'PIE',
    title: '折线图',
    func: PIE,
    props: [{
        name: 'source',
        title: '关系模型',
        dataType: 'var,relationalModel'
    }],
    returnType: 'dom'
});
