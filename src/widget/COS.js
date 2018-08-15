/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class COS extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.val = value;
        this.name = 'COS';
    }

    get value() {
        let result = this.val;
        if(result instanceof Obj) {
            result = result.value;
        }
        return Math.cos(result);
    }
}
__allMatch__.push({
    match: /^COS$/,
    title: 'COS',
    type: 'function',
    name: 'COS',
    func: COS,
    props: [{
        name: 'value',
        title: '计算项',
        dataType: 'number'
    }],
    returnType: 'number'
});
