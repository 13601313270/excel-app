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

class RADAR extends FuncObj {
    constructor(source, table, x, y, where) {
        super(...Array.from(arguments));
        this.name = 'RADAR';
        this.dom = document.createElement('div');
        this.dom.style.width = '100%';
        this.dom.style.height = '100%';
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
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: []
            },
            series: [{
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [4300, 10000, 28000, 35000, 50000, 19000],
                        name: '预算分配（Allocated Budget）'
                    },
                    {
                        value: [5000, 14000, 28000, 31000, 42000, 21000],
                        name: '实际开销（Actual Spending）'
                    }
                ]
            }]
        };
        option.radar.indicator = [];
        option.series[0].data = [];
        if(data.length > 0) {
            data.forEach((item) => {
                item.forEach((item2, key) => {
                    if(key < model.value.groupColumn.length) {
                        option.radar.indicator.push({name: item2, max: 2});
                    } else {
                        let thisOne = key - model.value.groupColumn.length;
                        if(option.series[0].data[thisOne] === undefined) {
                            option.series[0].data[thisOne] = {
                                name: model.value.dataColumn[key],
                                value: []
                            };
                        }
                        option.series[0].data[thisOne].value.push(item2);
                    }
                });
            });
        }
        this.myChart.setOption(option, true);
        setTimeout(() => {
            this.myChart.resize();
        }, 0);
    }
    reRender() {
        this.myChart.resize();
    }
}
__allMatch__.push({
    match: /^RADAR/,
    type: 'function',
    name: 'RADAR',
    title: '雷达图',
    func: RADAR,
    props: [{
        name: 'source',
        title: '关系模型',
        dataType: 'var,relationalModel'
    }],
    returnType: 'dom'
});
