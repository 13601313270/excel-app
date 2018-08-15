/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class MID extends FuncObj {
    constructor(text, begin, numChars) {
        super(...Array.from(arguments));
        this.name = 'MID';
        this.text = text;
        this.begin = begin;
        this.num_chars = numChars;
    }

    get value() {
        let text = this.text;
        if(text instanceof Obj) {
            text = text.value;
        }
        let begin = this.begin;
        if(begin instanceof Obj) {
            begin = begin.value;
        }
        let numChars = this.num_chars;
        if(numChars instanceof Obj) {
            numChars = numChars.value;
        }
        if(begin === 0) {
            return null;
        } else {
            return text.substr(begin - 1, numChars);
        }
    }
}
__allMatch__.push({
    match: /^MID$/,
    title: '文本截取',
    type: 'function',
    name: 'MID',
    func: MID,
    props: [{
        name: 'value',
        title: '字符串',
        dataType: 'string'
    }, {
        name: 'value',
        title: '开始点',
        dataType: 'number'
    }, {
        name: 'value',
        title: '截取长度',
        dataType: 'number'
    }],
    returnType: 'string'
});
