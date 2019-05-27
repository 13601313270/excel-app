/**
 * Created by ptmind on 2018/3/7.
 */
import Obj from '../observer/obj';
import createCodeText from '../languageParser/getStrByObj';
export default class extends Obj {
    constructor() {
        super();
        this.props = Array.from(arguments);
        this.type = 'function';
        this.dom = document.createElement('div');
    }

    render() {
        this.dom.innerHTML = this.value;
    }
    reRender() {
    }

    getCodeByObj() {
        let code = this.name + '(';
        let TempPropArr = [];
        this.props.forEach((item) => {
            TempPropArr.push(createCodeText(item));
        });
        code += TempPropArr.join(',');
        code += ')';
        return code;
    }
}
