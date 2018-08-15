/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class SUM extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'SUM';
    }

    get value() {
        let count = null;
        this.props.forEach((item) => {
            let itemVal = item;
            if(itemVal instanceof Obj) {
                itemVal = itemVal.value;
            }
            count += itemVal;
        });
        return count;
    }
}
__allMatch__.push({
    match: /^SUM$/,
    title: '求和',
    type: 'function',
    name: 'SUM',
    func: SUM,
    props: [{
        name: 'value',
        title: '求和项',
        dataType: ['number,var,function']
    }],
    returnType: 'number'
});
