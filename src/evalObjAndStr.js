/**
 * Created by ptmind on 2018/3/7.
 */
// 函数调用对象
// runObj执行这个方法的对象
import Obj from './observer/obj';
import __allMatch__ from './allMatch';
import allVar from './allVar';

class __runObj__ extends Obj {
    constructor(runObj, funcName, params) {
        super();
        this.runObj = runObj;
        this.funcName = funcName;
        this.params = params;
        // this.sentEvent = [];
        // this.using = [];
        this.state = 0;// 0正常,1锁定
        // 如果是函数调用,则有函数名
    }

    get value() {
        // 取值
        var runParams = [];
        for (let i = 0; i < this.params.length; i++) {
            var insert = this.params[i];
            if (insert instanceof Obj) {
                this.listen(insert);
                insert = insert.value;
                if (typeof insert === 'string') {
                    insert = '"' + insert + '"';
                }
            }
            if (this.funcName) {
                runParams.push(insert);
            } else {
                runParams.push(insert);
            }
        }
        if (this.funcName) {
            if (this.runObj === window) {
                return window[this.funcName].apply(window, runParams);
            } else {
                let temp = this.runObj.get();
                try {
                    return temp[this.funcName].apply(temp, runParams);
                } catch (e) {
                    return '';
                }
            }
        } else {
            try {
                // console.log(runParams);
                return eval(runParams.join(''));
            } catch (e) {
                return '';
            }
        }
    }
}
function getEvalObj(tableNum, str, isBind) {
    // 解释器梭子
    let forwordStrNum = 0;
    let maxLen = 255;

    function forword(putBack) {
        var oldPutBakc = forwordStrNum;
        var strSplit = '';
        var allUseWord = ['\n', '=', '(', ')', ',', ';', '"', '\'', ':', '+', '-', '*', '/', '.', '!', '>', '<', '[', ']'];
        while (forwordStrNum < str.length && str[forwordStrNum] === ' ') {
            forwordStrNum++;
        }
        if (allUseWord.indexOf(str[forwordStrNum]) > -1) {
            forwordStrNum++;
            var returnStr = str[forwordStrNum - 1];
            if (returnStr === '-') {
                var nearNum = str.substr(forwordStrNum).match(/^[\d|.]+/);
                if (nearNum !== null) {
                    returnStr += nearNum[0];
                    forwordStrNum += nearNum[0].length;
                }
            } else {
                var allTwoWord = ['>=', '<=', '=='];
                for (let i = 0; i < allTwoWord.length; i++) {
                    if (returnStr === allTwoWord[i][0] && str[forwordStrNum] === allTwoWord[i][1]) {
                        returnStr += str[forwordStrNum];
                        forwordStrNum++;
                        break;
                    }
                }
            }
            if (putBack) {
                forwordStrNum = oldPutBakc;
            }
            return returnStr;
        } else {
            for (let i = forwordStrNum; i < str.length; i++) {
                if (allUseWord.includes(str[i])) {
                    break;
                }
                forwordStrNum++;
                if (![' ', '\n'].includes(str[i])) {
                    strSplit += str[i];
                }
            }
            if (putBack) {
                forwordStrNum = oldPutBakc;
            }
            return strSplit;
        }
    }

    function functionCall(tableNum, word, baseWord) {
        var funcName = word;
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
                while (forwordStrNum < str.length - 1) {
                    params.push(forAction([',', ';', ')']));
                    if ([',', ';'].indexOf(forword(true)) > -1) {
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
                var applyArgs = [window].concat(params || []);
                var Temp = Function.prototype.bind.apply(func, applyArgs);
                var baseWord2 = new Temp();
                baseWord2.className = funcName;
                if (isBind) {
                    for (let i = 0; i < params.length; i++) {
                        if (params[i] instanceof Obj) {
                            baseWord2.listen(params[i]);
                        }
                    }
                }
                return baseWord2;
            } else {
                var returnObj;
                if (word === '.') {
                    var oldBase = baseWord;
                    returnObj = new __runObj__(oldBase, funcName, params);
                    if (isBind) {
                        returnObj.listen(oldBase);
                    }
                } else {
                    returnObj = new __runObj__(window, funcName, params);
                }
                if (isBind) {
                    for (let i = 0; i < params.length; i++) {
                        if (params[i] instanceof Obj) {
                            returnObj.listen(params[i])
                        }
                    }
                }
                return returnObj;
            }
        }
    }

    function forAction(endstrArr) {
        var baseWord = null;
        while (true) {
            maxLen--;
            if (forwordStrNum > str.length - 1 || maxLen <= 0) {
                break;
            }
            var word = forword(true);
            if (endstrArr !== undefined && endstrArr.indexOf(word) > -1) {
                return baseWord;
            }
            forword();
            if (['+', '-', '*', '/', '>', '<', '<=', '>='].indexOf(word) > -1) {
                var innerStrArr = [];
                if (typeof baseWord === 'string') {
                    innerStrArr.push('"' + baseWord + '"');
                } else {
                    innerStrArr.push(baseWord);
                }
                // console.log(baseWord);
                innerStrArr.push(word);
                while (true) {
                    var temp = '';
                    if (endstrArr !== undefined) {
                        temp = forAction(endstrArr.concat(['+', '-', '*', '/', '>', '<']));
                    } else {
                        temp = forAction(['+', '-', '*', '/', '>', '<']);
                    }
                    // console.log(temp);
                    if (typeof temp === 'string') {
                        innerStrArr.push('"' + temp + '"');
                    } else {
                        innerStrArr.push(temp);
                    }
                    var word2 = forword(true);
                    if (word2 === '') {
                        break;
                    } else if (endstrArr !== undefined && endstrArr.indexOf(word2) > -1) {
                        break;
                    } else {
                        innerStrArr.push(word2);
                        forword();
                    }
                }
                var insertObj = new __runObj__(window, '', innerStrArr);
                baseWord = insertObj;
                if (isBind) {
                    for (var i = 0; i < innerStrArr.length; i++) {
                        if (innerStrArr[i] instanceof Obj) {
                            baseWord.listen(innerStrArr[i]);
                        }
                    }
                }
            }
            else if (word === '"' || word === '\'') {
                var strTemp = '';
                for (let i = forwordStrNum; i < str.length; i++) {
                    if (str[i] === word) {
                        if (strTemp.substr(strTemp.length - 1) === '\\') {
                        } else {
                            break;
                        }
                    }
                    forwordStrNum++;
                    strTemp += str[i];
                }
                forwordStrNum++;
                baseWord = strTemp;
            }
            // else if (word === ':') {
            //     if (endstrArr === undefined) {
            //         var end = forAction(['+', '-', '*', '/', '>', '<', ')']);
            //     } else {
            //         var end = forAction(endstrArr.concat(['+', '-', '*', '/', '>', '<', ')']));
            //     }
            //     if (baseWord.tableId === end.tableId) {
            //         var resultList = new tdList(baseWord, end);
            //         var tableId = baseWord.tableId;
            //         for (let i = baseWord.hang; i <= end.hang; i++) {
            //             for (let j = baseWord.lie; j <= end.lie; j++) {
            //                 var tdStr = getCellTemp2(i, j);
            //                 var bindTemp = baseWord.table.findChild(tdStr);
            //                 if (isBind) {
            //                     bindTemp.listen(resultList);
            //                 }
            //             }
            //         }
            //         baseWord = resultList;
            //     } else {
            //         throw new DOMException('tdList必须在一张表上');
            //     }
            // }
            else if (word === '.' || typeof window[word] === 'function') {
                baseWord = functionCall(tableNum, word, baseWord);
            }
            else {
                var matchObj = null;
                for (let i = 0; i < __allMatch__.length; i++) {
                    if (__allMatch__[i].type === 'function' && word.match(__allMatch__[i].match)) {
                        matchObj = functionCall(tableNum, __allMatch__[i].func, baseWord);
                    } else if (word.match(__allMatch__[i].match)) {
                        matchObj = __allMatch__[i].value(tableNum, word, baseWord, function(endStrArrStep, extendParentEnd) {
                            if (extendParentEnd === false) {
                                return forAction(endStrArrStep);
                            } else {
                                return forAction(endstrArr.concat(endStrArrStep));
                            }
                        }, function(putback) {
                            let nextWord = forword(putback);
                            if (forwordStrNum >= str.length) {
                                return undefined;
                            }
                            return nextWord;
                        });
                        break;
                    }
                }
                if (matchObj === null) {
                    var isTableName = false;
                    // for (var i = 0; i < tdData.length; i++) {
                    //     if (tdData[i].tableTitle === word) {
                    //         isTableName = true;
                    //         baseWord = word;
                    //         break;
                    //     }
                    // }
                    if (isTableName === false) {
                        // console.log('----------');
                        // // console.log(str);
                        // console.log(str.substr(forwordStrNum - 2, 10000));
                        // console.log(baseWord);
                        // console.log(word);
                        // console.log(word + 'wrong');
                    }
                } else {
                    baseWord = matchObj;
                }
            }
        }
        return baseWord;
    }

    let allAction = [];
    while (forwordStrNum < str.length) {
        let begin = forwordStrNum;
        let codeLine = forAction('\n');
        if (codeLine !== null) {
            let codeText = str.substring(begin, forwordStrNum);
            codeText = codeText.replace(/^\s*\$[A-Z|a-z|\d]+\s*=\s*/, '');
            codeLine.codeText = codeText;
            allAction.push(codeLine);
        }
        forword();
    }
    allVar.start();
    return allAction;
}
export default getEvalObj;
