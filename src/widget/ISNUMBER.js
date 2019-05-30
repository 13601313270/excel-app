/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class ISNUMBER extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'ISNUMBER';
        this.val = value;
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return typeof result === 'number';
    }
}
__allMatch__.push({
    match: /^ISNUMBER$/,
    title: '判断是否是数字',
    type: 'function',
    name: 'ISNUMBER',
    func: ISNUMBER,
    props: [{
        name: 'value',
        title: '判断值',
        dataType: ''
    }],
    returnType: 'boolean'
});
