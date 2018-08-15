/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class CHOOSE extends FuncObj {
    constructor() {
        super(...Array.from(arguments));
        this.name = 'CHOOSE';
        this.index = arguments[0];
    }

    get value() {
        let result = this.props[this.index];
        if(result instanceof Obj) {
            result = result.value;
        }
        return result;
    }
}
__allMatch__.push({
    match: /^CHOOSE$/,
    title: 'CHOOSE',
    type: 'function',
    name: 'CHOOSE',
    func: CHOOSE,
    props: [{
        name: 'value',
        title: '索引值',
        dataType: 'number'
    }, {
        name: 'value',
        title: '值',
        dataType: ['']
    }],
    returnType: 'number'
});
