/**
 * Created by ptmind on 2018/3/9.
 */
import echarts from 'echarts';
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import Var from '../observer/Var';
// import ajax from '../api/ajax';
class BAR extends FuncObj {
    constructor(source, table, x, y) {
        super(...Array.from(arguments));
        this.name = 'BAR';
        this.dom = document.createElement('div');
        this.myChart = echarts.init(this.dom);
        this.myChart.on('click', (params) => {
            this.value33 = params.data;
            this.dep.update();// release
        });
    }

    get value() {
        if (this.value33 instanceof Obj) {
            return this.value33.value;
        } else {
            return this.value33;
        }
    }

    render(handle) {
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
        // [{"count(33)":"1","count(email)":"1","state":"1"}]
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
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option);
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
