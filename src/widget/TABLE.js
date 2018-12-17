/**
 * Created by ptmind on 2018/3/9.
 */
import echarts from 'echarts';
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import Var from '../observer/Var';
import Dict from '../languageParser/dictionary';
import tableVue from './TABLE.vue';
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

class TABLE extends FuncObj {
    constructor(source, table, x, y, where) {
        super(...Array.from(arguments));
        this.name = 'TABLE';
        this.dom = [
            tableVue,
            {
                value: this.value
            }
        ];
    }

    get value() {
        return this.dict.value;
    }

    render(handle) {
        // let self = this;
        // let model = this.props[0];
        // if(model instanceof Var) {
        //     model = model.value_;
        // }
        // if(model === '') {
        //     handle(false);
        //     return;
        // }
        // let data = model.value.dataValue;
        // let option = {
        //     tooltip: {},
        //     legend: {
        //         data: model.value.dataColumn
        //     },
        //     xAxis: {
        //         data: []
        //     },
        //     yAxis: {},
        //     series: []
        // };
        // option.xAxis.data = [];
        // option.series = [];
    }
}
__allMatch__.push({
    match: /^TABLE/,
    type: 'function',
    name: 'TABLE',
    title: '表格',
    func: TABLE,
    props: [{
        name: 'source',
        title: '关系模型',
        dataType: 'var,relationalModel'
    }],
    returnType: 'dom'
});
