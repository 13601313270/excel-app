/**
 * Created by ptmind on 2018/3/9.
 */
import FuncObj from '../FuncObj'
import Obj from '../obj'
class MIN extends FuncObj {
    constructor(value) {
        super(...Array.from(arguments))
        this.name = 'MIN'
        this.dom = document.createElement('div')
        this.props.forEach((item) => {
            if (item instanceof Obj) {
                item.listen(this)
            }
        })
        this.render()
    }

    render() {
        this.dom.innerHTML = this.value
    }

    // set value(val) {
    //     super.render();
    // }

    get value() {
        let min = null
        this.props.forEach((item) => {
            let itemVal = item
            if (itemVal instanceof Obj) {
                itemVal = itemVal.value
            }
            if (itemVal < min || min === null) {
                min = itemVal
            }
        })
        return min
    }
}
export default {
    match: /^MIN/,
    title: '最小值',
    type: 'function',
    name: 'MIN',
    func: MIN,
    props: [{
        name: 'value',
        title: '比较项',
        dataType: ['number']
    }]
}
