/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class RIGHT extends FuncObj {
    constructor(text, numChars) {
        super(...Array.from(arguments));
        this.name = 'RIGHT';
        this.text = text;
        this.num_chars = numChars;
    }

    get value() {
        let text = this.text;
        if(text instanceof Obj) {
            text = text.value;
        }
        let numChars = this.num_chars;
        if(numChars instanceof Obj) {
            numChars = numChars.value;
        }
        return text.substr(text.length - numChars, numChars);
    }
}
__allMatch__.push({
    match: /^RIGHT$/,
    title: '文本右侧截取',
    type: 'function',
    name: 'RIGHT',
    func: RIGHT,
    props: [{
        name: 'value',
        title: '字符串',
        dataType: 'string'
    }, {
        name: 'value',
        title: '截取长度',
        dataType: 'number'
    }],
    returnType: 'string'
});
