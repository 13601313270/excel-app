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
            // handle(false);
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
                            option.series[thisOne] = {
                                type: 'pie',
                                radius: radius,
                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
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
