/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class MOD extends FuncObj {
    constructor(value, value2) {
        super(...Array.from(arguments));
        this.name = 'MOD';
        this.val = value;
        this.value2 = value2;
    }

    get value() {
        let val = this.val;
        if(val instanceof Obj) {
            val = val.value;
        }
        let value2 = this.value2;
        if(value2 instanceof Obj) {
            value2 = value2.value;
        }
        return val % value2;
    }
}
__allMatch__.push({
    match: /^MOD$/,
    title: '余数',
    type: 'function',
    name: 'MOD',
    func: MOD,
    props: [{
        name: 'value',
        title: '被除数',
        dataType: 'number'
    }, {
        name: 'value',
        title: '除数',
        dataType: 'number'
    }],
    returnType: 'number'
});
