/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class AND extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'AND';
    }

    get value() {
        let result = true;
        this.props.forEach((item) => {
            let itemVal = item;
            if(itemVal instanceof Obj) {
                itemVal = itemVal.value;
            }
            if(Boolean(itemVal) === false) {
                result = false;
            }
        });
        return result;
    }
}
__allMatch__.push({
    match: /^AND$/,
    title: 'AND',
    type: 'function',
    name: 'AND',
    func: AND,
    props: [{
        name: 'value',
        title: '比较项',
        dataType: ['number,var,function']
    }],
    returnType: 'boolean'
});
