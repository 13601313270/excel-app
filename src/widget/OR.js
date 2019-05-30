/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class OR extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'OR';
    }

    get value() {
        let result = false;
        this.props.forEach((item) => {
            let itemVal = item;
            if(itemVal instanceof Obj) {
                itemVal = itemVal.value;
            }
            if(Boolean(itemVal) === true) {
                result = true;
            }
        });
        return result;
    }
}
__allMatch__.push({
    match: /^OR$/,
    title: 'OR',
    type: 'function',
    name: 'OR',
    func: OR,
    props: [{
        name: 'value',
        title: '比较项',
        dataType: ['number,var,function']
    }],
    returnType: 'boolean'
});
