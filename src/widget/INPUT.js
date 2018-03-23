/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj';

class INPUT extends FuncObj {
    constructor(type, value) {
        super(...Array.from(arguments));
        this.name = 'INPUT';
        this.dom = document.createElement('input');
        // this.dom.type = type;
        let self = this;
        this.dom.addEventListener('change', function() {
            if (type === 'number') {
                self.valueee = parseFloat(this.value);
            } else {
                self.valueee = this.value.toString();
            }
            self.dep.update();// release
        });
        this.valueee = value;// 0正常,1锁定
    }

    get value() {
        return this.valueee;
    }

    render() {
        this.dom.value = this.valueee;
    }
}
export default {
    match: /^INPUT$/,
    type: 'function',
    name: 'INPUT',
    title: '输入框',
    func: INPUT,
    props: [
        {
            name: 'type',
            title: '类型',
            dataType: 'string',
            enum: {
                'number': '数字',
                'string': '字符串'
            }
        },
        {
            name: 'value:',
            title: '默认值',
            dataType: 'string',
            default: ''
        }
    ]
};
