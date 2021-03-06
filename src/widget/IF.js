/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class IF extends FuncObj {
    constructor(judge, obj1, obj2) {
        super(...Array.from(arguments));
        this.dep.name = 'IF';
        this.name = 'IF';
    }

    render() {
        super.render();
    }

    get value() {
        if (this.props[0] === true || (this.props[0] instanceof Obj && this.props[0].value === true)) {
            return this.props[1] instanceof Obj ? this.props[1].value : this.props[1];
        } else {
            return this.props[2] instanceof Obj ? this.props[2].value : this.props[2];
        }
    }
}
__allMatch__.push({
    match: /^IF$/,
    title: '判断',
    type: 'function',
    name: 'IF',
    func: IF,
    props: [{
        name: 'judge',
        title: '判断条件',
        dataType: 'bool,function,var'
    }, {
        name: 'obj1',
        title: '真值运算',
        dataType: 'number,function,var'
    }, {
        name: 'obj2',
        title: '假值运算',
        dataType: 'number,function,var'
    }],
    returnType: 'number,var'
});
