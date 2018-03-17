/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj'
class INPUT_DATE extends FuncObj {
    constructor(defaultVallue) {
        super(...Array.from(arguments))
        this.name = 'INPUT_DATE'
        this.dom = document.createElement('input')
        this.dom.type = 'date'
        let this_ = this
        this.dom.addEventListener('change', function() {
            this_.value = this.value
        })
        this.value = defaultVallue// 0正常,1锁定
    }

    render() {
        this.dom.value = this.value
    }
}

export default {
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
    ]
}
