/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class MAX extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'MAX';
    }

    get value() {
        let max = null;
        this.props.forEach((item) => {
            let itemVal = item;
            if (itemVal instanceof Obj) {
                itemVal = itemVal.value;
            }
            if (itemVal > max || max === null) {
                max = itemVal;
            }
        });
        return max;
    }
}
__allMatch__.push({
    match: /^MAX$/,
    title: '最大值',
    type: 'function',
    name: 'MAX',
    func: MAX,
    props: [{
        name: 'value',
        title: '比较项',
        dataType: ['number,var,function']
    }],
    returnType: 'number'
});
