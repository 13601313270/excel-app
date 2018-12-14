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
        this.dom = [
            check,
            {
                name: this.name
            },
            {
                change(state) {
                    alert(state);
                }
            }
        ];
        // document.createElement('div');
        // this.dom.innerHTML = `<div
        //         style="width: 40px;border: solid 1px #bababa;border-radius: 20px;display: inline-block;height: 24px;position: relative">
        //         <div
        //             style="position: absolute;width: 20px;height: 20px;background-color: gray;border-radius: 50%;top: 2px;left: 2px;"></div>
        //     </div>`;
        // this.dom.checked = value;
        // this.dom.type = 'checkbox';
        // let self = this;
        this.isSelect = value;
    }

    vue() {
        return {};
    };

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
    ],
    returnType: 'dom'
});
