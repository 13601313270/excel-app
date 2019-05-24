/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';

class TEXT extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'TEXT';
        this.text = value;
    }

    get value() {
        if (this.text instanceof Obj) {
            if (this.text.value !== null && this.text.value !== undefined) {
                return this.text.value.toString();
            } else {
                return '';
            }
        } else {
            return this.text.toString();
        }
    }
}

__allMatch__.push({
    match: /^TEXT$/,
    title: '文本',
    type: 'function',
    name: 'TEXT',
    func: TEXT,
    props: [
        {
            name: 'value',
            title: '文字值',
            dataType: 'string,number,bool,function,var'
        }
    ],
    returnType: 'string'
});
