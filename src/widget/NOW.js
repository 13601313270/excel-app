/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import __allMatch__ from '../languageParser/allMatch';
class NOW extends FuncObj {
    constructor() {
        super(...Array.from(arguments));
        this.name = 'NOW';
    }

    get value() {
        return new Date();
    }
}
__allMatch__.push({
    match: /^NOW$/,
    title: '当前日期和时间',
    type: 'function',
    name: 'NOW',
    func: NOW,
    props: [],
    returnType: 'number'
});
