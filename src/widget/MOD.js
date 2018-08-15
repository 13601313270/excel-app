/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class INT extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.val = value;
        this.name = 'INT';
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return parseInt(result);
    }
}
__allMatch__.push({
    match: /^INT$/,
    title: '取整',
    type: 'function',
    name: 'INT',
    func: INT,
    props: [{
        name: 'value',
        title: '计算项',
        dataType: 'number'
    }],
    returnType: 'number'
});
