/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import __allMatch__ from '../languageParser/allMatch';
class INPUT_DATE extends FuncObj {
    constructor(defaultVallue) {
        super(...Array.from(arguments));
        this.name = 'INPUT_DATE';
        this.dom = document.createElement('input');
        this.dom.type = 'date';
        let this_ = this;
        this.dom.addEventListener('change', function() {
            this_.valueee = this.value;
            this_.dep.update();// release
        });
        this.valueee = defaultVallue;// 0正常,1锁定
    }

    get value() {
        return this.valueee;
    }

    render() {
        this.dom.value = this.value;
    }
}

__allMatch__.push({
    match: /^INPUT_DATE/,
    type: 'function',
    name: 'INPUT_DATE',
    title: '日期选择器',
    func: INPUT_DATE,
    props: [
        {
            name: 'value:',
            title: '默认值',
            dataType: 'string',
            default: ''
        }
    ],
    returnType: 'dom',
    defaultSize: {
        width: 143,
        height: 27
    }
});
