/**
 * Created by ptmind on 2018/3/26.
 */
import FuncObj from './FuncObj';
import Var from './observer/Var';
import Obj from './observer/obj';
import __runObj__ from './__runObj__';
function createCodeText(runObj) {
    let code = '';
    if (runObj instanceof FuncObj) {
        code += runObj.name + '(';
        let TempPropArr = [];
        runObj.props.forEach((item) => {
            TempPropArr.push(createCodeText(item));
        });
        code += TempPropArr.join(',');
        code += ')';
    } else if (runObj instanceof Var) {
        code = runObj.name;
    } else if (runObj instanceof __runObj__) {
        if (runObj.funcName) {
            code += runObj.funcName + '(';
        }
        let runParams = [];
        for (let i = 0; i < runObj.params.length; i++) {
            let insert = runObj.params[i];
            if (insert instanceof Obj) {
                insert = createCodeText(insert);
            }
            runParams.push(insert);
        }
        code += runParams.join('');
        if (runObj.funcName) {
            code += ')';
        }
    } else if (typeof runObj === 'string') {
        code = '"' + runObj + '"';
    } else if (typeof runObj === 'number') {
        code = runObj;
    } else if (typeof runObj === 'boolean') {
        code = runObj ? 'TRUE' : 'FALSE';
    }
    return code;
}
export default createCodeText;
