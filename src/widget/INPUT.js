/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import __allMatch__ from '../languageParser/allMatch';
import Obj from '../observer/obj';
import uInput from '../components/ui/input';

class INPUT extends FuncObj {
    constructor(type, value) {
        super(...Array.from(arguments));
        this.name = 'INPUT';
        let self = this;
        this.valueee = value;// 0正常,1锁定
        this.dom = [
            uInput, {
                value: this.value
            }, {
                change(val) {
                    if (type === 'number') {
                        self.valueee = parseFloat(val);
                    } else {
                        self.valueee = val;
                    }
                    self.dep.update();// release
                }
            }
        ];
    }

    get value() {
        if (this.valueee instanceof Obj) {
            return this.valueee.value;
        } else {
            return this.valueee;
        }
    }

    render() {
    }
    reRender() {
    }
}

__allMatch__.push({
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
            dataType: (props) => {
                return props[0];
            },
            default: ''
        }
    ],
    returnType: 'dom',
    defaultSize: {
        width: 133,
        height: 24
    }
});
