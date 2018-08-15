/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class NOT extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'NOT';
        this.val = value;
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return !result;
    }
}
__allMatch__.push({
    match: /^NOT$/,
    title: 'NOT',
    type: 'function',
    name: 'NOT',
    func: NOT,
    props: [{
        name: 'value',
        title: '比较项',
        dataType: 'bool'
    }],
    returnType: 'bool'
});
