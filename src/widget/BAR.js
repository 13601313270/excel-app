/**
 * Created by ptmind on 2018/3/9.
 */
import echarts from 'echarts';
import FuncObj from '../FuncObj';
import Obj from '../observer/obj';
class BAR extends FuncObj {
    constructor(source, x, y, begin, end) {
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
        console.log('bar render');
        let begin = this.props[3];
        if (begin instanceof Obj) {
            begin = begin.value;
        }
        let end = this.props[4];
        if (end instanceof Obj) {
            end = end.value;
        }
        var option = {
            tooltip: {},
            // legend: {
            //     data: ['销量']
            // },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: [{
                type: 'bar',
                data: [6.71, 6.6, 6.57, 6.5, 6.68, 6.73, 6.71, 6.6, 6.57, 6.5, 6.68, 6.73]
            }]
        };
        option.xAxis.data = [];
        var timeItem = new Date(begin);
        for (var i = 0; i < 100; i++) {
            option.xAxis.data.push((timeItem.getYear() + 1900) + '-' + (timeItem.getMonth() + 1) + '-' + (timeItem.getDate()));
            timeItem = new Date(timeItem.getTime() + 24 * 60 * 60 * 1000);
            if (timeItem > new Date(end)) {
                break;
            }
        }
        option.series[0].data = option.series[0].data.splice(0, option.xAxis.data.length);
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option);
        setTimeout(() => {
            this.dom.style.width = '500px';
            this.dom.style.height = '300px';
            this.myChart.resize();
        }, 2000);
    }
}
export default {
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
            name: 'x:',
            title: 'X轴',
            dataType: 'string',
            default: ''
        },
        {
            name: 'y:',
            title: 'Y轴',
            dataType: 'string',
            default: ''
        },
        {
            name: 'begin:',
            title: '开始时间',
            dataType: 'string',
            default: ''
        },
        {
            name: 'end:',
            title: '结束时间',
            dataType: 'string',
            default: ''
        }
    ]
};
