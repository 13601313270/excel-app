/**
 * Created by ptmind on 2018/3/9.
 */
import echarts from 'echarts';
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import ajax from '../api/ajax';
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

    render() {
        let source = this.props[0] instanceof Obj ? this.props[0].value : this.props[0];
        let table = this.props[1] instanceof Obj ? this.props[1].value : this.props[1];
        let x = this.props[2] instanceof Obj ? this.props[2].value : this.props[2];
        let y = this.props[3] instanceof Obj ? this.props[3].value : this.props[3];
        let option = {
            tooltip: {},
            // legend: {
            //     data: ['销量']
            // },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: []
        };
        ajax({
            type: 'POST',
            url: 'http://www.tablehub.cn/action/mysql.html',
            data: {
                type: 'run',
                connection: parseInt(source),
                table: table,
                sql: {
                    select: y.concat(x),
                    groupBy: x
                }
            }
        }).then((data) => {
            option.xAxis.data = [];
            option.series = [];
            // [{"count(33)":"1","count(email)":"1","state":"1"}]
            data.forEach((item, index) => {
                for (let i in item) {
                    if (y.includes(i)) {
                        if (option.series[y.indexOf(i)] === undefined) {
                            option.series[y.indexOf(i)] = {type: 'bar', data: []};
                        }
                        option.series[y.indexOf(i)].data.push(item[i]);
                    } else if (i === x) {
                        option.xAxis.data.push(item[i]);
                    }
                }
            });
            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(option);
            setTimeout(() => {
                this.dom.style.width = '500px';
                this.dom.style.height = '300px';
                this.myChart.resize();
            }, 0);
        });
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
            title: '数据源',
            dataType: 'string',
            default: ''
        },
        {
            name: 'table:',
            title: '表',
            dataType: 'string',
            default: ''
        },
        {
            name: 'x:',
            title: 'X轴',
            dataType: 'string',
            default: ''
        },
        {
            name: 'y:',
            title: 'Y轴',
            dataType: 'array',
            default: ''
        }
    ]
});
