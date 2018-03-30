/**
 * Created by ptmind on 2018/3/30.
 */
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import funcLanguageParser from '../languageParser/functionCall';
import createCodeText from '../languageParser/getStrByObj';

class relationalModel extends Obj {
    constructor() {
        console.log(Array.from(arguments));
        super();
        this.props = Array.from(arguments);
        this.type = 'function';
        this.dom = document.createElement('div');
    }

    render() {
        this.dom.innerHTML = this.value;
    }

    getCodeByObj() {
        let code = 'RELATIONAL_MODEL(';
        let TempPropArr = [];
        this.props.forEach((item) => {
            TempPropArr.push(createCodeText(item));
        });
        code += TempPropArr.join(',');
        code += ')';
        return code;
    }
}
__allMatch__.push({
    match: /^RELATIONAL_MODEL/,
    type: 'relationalModel',
    name: 'relationalModel',
    title: '关系模型',
    func: relationalModel,
    value: funcLanguageParser
});
export default relationalModel;
