/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class MIN extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'MIN';
    }

    get value() {
        let min = null;
        this.props.forEach((item) => {
            let itemVal = item;
            if (itemVal instanceof Obj) {
                itemVal = itemVal.value;
            }
            if (itemVal < min || min === null) {
                min = itemVal;
            }
        });
        return min;
    }
}
__allMatch__.push({
    match: /^MIN$/,
    title: '最小值',
    type: 'function',
    name: 'MIN',
    func: MIN,
    props: [{
        name: 'value',
        title: '比较项',
        dataType: ['number']
    }]
});
