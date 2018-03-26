/**
 * Created by ptmind on 2018/3/26.
 */
import FuncObj from './FuncObj';
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
