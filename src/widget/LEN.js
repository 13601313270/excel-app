/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class LEN extends FuncObj {
    constructor(text) {
        super(...Array.from(arguments));
        this.name = 'LEN';
        this.text = text;
    }

    get value() {
        let text = this.text;
        if(text instanceof Obj) {
            text = text.value;
        }
        return text.toString().length;
    }
}
__allMatch__.push({
    match: /^LEN$/,
    title: '文本长度',
    type: 'function',
    name: 'LEN',
    func: LEN,
    props: [{
        name: 'value',
        title: '字符串',
        dataType: 'string'
    }],
    returnType: 'number'
});
