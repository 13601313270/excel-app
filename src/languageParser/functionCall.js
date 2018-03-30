/**
 * Created by ptmind on 2018/3/30.
 */
import Obj from '../observer/obj';
import __runObj__ from './__runObj__';
function functionCall(tableNum, word, baseWord, forAction, forword) {
    let funcName = word;
    if (word === '.') {
        funcName = forword();
    }
    if (forword(true) === '(') {
        forword();
        let params = [];
        // 参数
        if (forword(true) === ')') {
            forword();
        } else {
            let limit = 0;
            while (limit++ < 9999) {
                params.push(forAction([',', ';', ')']));
                let nextKey = forword(true);
                if (nextKey === undefined) {
                    break;
                } else if ([',', ';'].indexOf(forword(true)) > -1) {
                    forword();
                } else if (forword(true) === ')') {
                    forword();
                    break;
                }
            }
        }
        let func;
        if (typeof funcName === 'function') {
            func = funcName;
        } else {
            func = window[funcName];
        }

        if (typeof func === 'function' && func.prototype instanceof Obj) {
            let applyArgs = [window].concat(params || []);
            let Temp = Function.prototype.bind.apply(func, applyArgs);
            let baseWord2 = new Temp();
            baseWord2.className = funcName;
            for (let i = 0; i < params.length; i++) {
                if (params[i] instanceof Obj) {
                    baseWord2.listen(params[i]);
                }
            }
            return baseWord2;
        } else {
            let returnObj;
            if (word === '.') {
                let oldBase = baseWord;
                returnObj = new __runObj__(oldBase, funcName, params);
                returnObj.listen(oldBase);
            } else {
                returnObj = new __runObj__(window, funcName, params);
            }
            for (let i = 0; i < params.length; i++) {
                if (params[i] instanceof Obj) {
                    returnObj.listen(params[i]);
                }
            }
            return returnObj;
        }
    }
}
export default functionCall;
