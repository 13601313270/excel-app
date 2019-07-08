/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from './FuncObj';
import __allMatch__ from '../languageParser/allMatch';
import check from './CHECK_BOX.vue';

class CHECK_BOX extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments));
        this.name = 'CHECK_BOX';
        this.isSelect = value;
        let self = this;
        this.dom = [
            check,
            {
                value: this.isSelect
            },
            {
                change(state) {
                    self.isSelect = state;
                    self.dep.update();
                }
            }
        ];
    }

    get value() {
        return this.isSelect;
    }

    render() {
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
            dataType: 'boolean',
            default: ''
        }
    ],
    returnType: 'dom',
    minSize: {
        width: 42,
        height: 26
    }
});
