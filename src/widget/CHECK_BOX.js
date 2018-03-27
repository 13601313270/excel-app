/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj';
import __allMatch__ from '../languageParser/allMatch';
class CHECK_BOX extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'CHECK_BOX';
        this.dom = document.createElement('input');
        this.dom.checked = value;
        this.dom.type = 'checkbox';
        let self = this;
        this.dom.addEventListener('change', function() {
            self.isSelect = this.checked;
            self.dep.update();
        });
        this.isSelect = value;
    }

    get value() {
        return this.isSelect;
    }

    render() {
        this.dom.value = this.isSelect;
    }
}
__allMatch__.push({
    match: /^CHECK_BOX$/,
    type: 'function',
    name: 'CHECK_BOX',
    title: '开关器',
    func: CHECK_BOX,
    props: [
        {
            name: 'value:',
            title: '默认值',
            dataType: 'bool',
            default: ''
        }
    ]
});
