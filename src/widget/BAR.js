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
        let xColumn = new Temp();
        let select = new Temp();
        let value = new Temp();
        this.dict = new Dict({
            x: xColumn,
            select: select,
            value: value
        });
        this.myChart.on('click', (params) => {
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
        if (model instanceof Var) {
            model = model.value_;
        }
        console.log(model);
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
                let dataItem = {
                    type: 'bar', data: []
                };
                item.forEach((item2, key) => {
                    if (key < model.groupColumn.length) {
                        option.xAxis.data.push(item2);
                    } else {
                        if (option.series[key - model.groupColumn.length] === undefined) {
                            option.series[key - model.groupColumn.length] = {
                                type: 'bar',
                                name: model.dataColumn[key - model.groupColumn.length],
                                data: []
                            };
                        }
                        option.series[key - model.groupColumn.length].data.push(item2);
                    }
                });
                option.series.push(dataItem);
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
