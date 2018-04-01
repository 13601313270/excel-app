/**
 * Created by ptmind on 2018/3/26.
 */
import Obj from '../observer/obj';
function createCodeText(runObj) {
    let code = '';
    if (typeof runObj === 'string') {
        code = '"' + runObj + '"';
    } else if (typeof runObj === 'number') {
        code = runObj;
    } else if (typeof runObj === 'boolean') {
        code = runObj ? 'TRUE' : 'FALSE';
    } else if (runObj instanceof Obj && runObj.getCodeByObj) {
        code = runObj.getCodeByObj();
    }
    return code;
}
export default createCodeText;
