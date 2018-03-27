/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj';
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
class TEXT extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'TEXT';
        this.dom = document.createElement('div');
        this.valueeee = value;
    }

    get value() {
        if (this.valueeee instanceof Obj) {
            return this.valueeee.value;
        } else {
            return this.valueeee;
        }
    }

    render() {
        this.dom.innerHTML = this.value;
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
            title: '默认文字值',
            dataType: 'string'
        }
    ]
});
