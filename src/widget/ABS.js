/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class ABS extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.val = value;
        this.name = 'ABS';
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return Math.abs(result);
    }
}
__allMatch__.push({
    match: /^ABS$/,
    title: '取绝对值',
    type: 'function',
    name: 'ABS',
    func: ABS,
    props: [{
        name: 'value',
        title: '计算项',
        dataType: 'number'
    }],
    returnType: 'number'
});
