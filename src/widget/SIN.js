/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class SIN extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.val = value;
        this.name = 'SIN';
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return Math.sin(result);
    }
}
__allMatch__.push({
    match: /^SIN$/,
    title: 'SIN',
    type: 'function',
    name: 'SIN',
    func: SIN,
    props: [{
        name: 'value',
        title: '计算项',
        dataType: 'number'
    }],
    returnType: 'number'
});
