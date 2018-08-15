/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import __allMatch__ from '../languageParser/allMatch';
class TODAY extends FuncObj {
    constructor() {
        super(...Array.from(arguments));
        this.name = 'TODAY';
    }

    get value() {
        return new Date();
    }
}
__allMatch__.push({
    match: /^TODAY$/,
    title: '当前日期',
    type: 'function',
    name: 'TODAY',
    func: TODAY,
    props: [],
    returnType: 'number'
});
