/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class AVERAGE extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'AVERAGE';
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
        return count / this.props.length;
    }
}
__allMatch__.push({
    match: /^AVERAGE$/,
    title: '平均数',
    type: 'function',
    name: 'AVERAGE',
    func: AVERAGE,
    props: [{
        name: 'value',
        title: '计算项',
        dataType: ['number,var,function']
    }],
    returnType: 'number'
});
