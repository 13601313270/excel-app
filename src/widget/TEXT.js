/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj'
class TEXT extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments))
        this.name = 'TEXT'
        this.dom = document.createElement('div')
        this.value = value
    }

    render() {
        this.dom.innerHTML = this.value
    }
}
export default {
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
}
