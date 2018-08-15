/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class TAN extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.val = value;
        this.name = 'TAN';
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return Math.tan(result);
    }
}
__allMatch__.push({
    match: /^TAN$/,
    title: 'TAN',
    type: 'function',
    name: 'TAN',
    func: TAN,
    props: [{
        name: 'value',
        title: '计算项',
        dataType: 'number'
    }],
    returnType: 'number'
});
