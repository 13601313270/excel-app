import FuncObj from './FuncObj';
import __allMatch__ from '../languageParser/allMatch';
import Var from '../observer/Var';
import tableVue from './TABLE.vue';

class TABLE extends FuncObj {
    constructor(source, pageSize = 10) {
        super(...Array.from(arguments));
        this.name = 'TABLE';
        this.model = this.value;
        this.dom = [
            tableVue,
            {
                value: this.model,
                pageSize
            }
        ];
    }

    get value() {
        let model = this.props[0];
        if(model instanceof Var) {
            model = model.value_;
        }
        return model.value;
    }

    check() {
        return (typeof this.value === 'object' && this.value.type === 'relationalModel');
    }

    render(handle) {
        // let self = this;
        let model = this.props[0];
        if(model instanceof Var) {
            model = model.value_;
        }
        model = model.value;
        if(model === '') {
            // handle(false);
            return;
        }
        this.model.groupColumn = model.groupColumn;
        this.model.dataColumn = model.dataColumn;
        this.model.dataValue = model.dataValue;
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
