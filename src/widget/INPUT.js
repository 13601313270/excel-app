/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj'

class INPUT extends FuncObj {
    constructor(type, value) {
        super(...Array.from(arguments))
        this.name = 'INPUT'
        this.dom = document.createElement('input')
        // this.dom.type = type;
        let this_ = this
        this.dom.addEventListener('change', function() {
            if (type === 'number') {
                this_.value = parseFloat(this.value)
            } else {
                this_.value = this.value
            }
        })
        this.value = value// 0正常,1锁定
    }

    render() {
        this.dom.value = this.value
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
}
