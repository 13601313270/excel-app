/**
 * Created by ptmind on 2018/3/7.
 */
// 函数调用对象
// runObj执行这个方法的对象
import Obj from '../observer/obj';
import __allMatch__ from './allMatch';
import __runObj__ from './__runObj__';
import functionCall from './functionCall';
function getEvalObj(tableNum, str) {
    // 解释器梭子
    let forwordStrNum = 0;
    let maxLen = 255;

    function forword(putBack) {
        let oldPutBakc = forwordStrNum;
        let strSplit = '';
        let allUseWord = ['\n', '=', '(', ')', ',', ';', '"', '\'', ':', '+', '-', '*', '/', '.', '!', '>', '<', '[', ']', '{', '}'];
        while (forwordStrNum < str.length && str[forwordStrNum] === ' ') {
            forwordStrNum++;
        }
        if (allUseWord.indexOf(str[forwordStrNum]) > -1) {
            forwordStrNum++;
            let returnStr = str[forwordStrNum - 1];
            if (returnStr === '-') {
                let nearNum = str.substr(forwordStrNum).match(/^[\d|.]+/);
                if (nearNum !== null) {
                    returnStr += nearNum[0];
                    forwordStrNum += nearNum[0].length;
                }
            } else {
                let allTwoWord = ['>=', '<=', '=='];
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

    function forAction(endstrArr) {
        if (endstrArr === undefined) {
            endstrArr = [];
        }
        let baseWord = null;
        while (true) {
            maxLen--;
            if (forwordStrNum > str.length - 1 || maxLen <= 0) {
                break;
            }
            let word = forword(true);
            if (endstrArr.includes(word)) {
                return baseWord;
            }
            forword();
            if (['+', '-', '*', '/', '>', '<', '<=', '>=', '=='].indexOf(word) > -1) {
                let innerStrArr = [];
                if (typeof baseWord === 'string') {
                    innerStrArr.push('"' + baseWord + '"');
                } else {
                    innerStrArr.push(baseWord);
                }
                innerStrArr.push(word);
                while (true) {
                    let temp = forAction(endstrArr.concat(['+', '-', '*', '/', '>', '<']));
                    if (typeof temp === 'string') {
                        innerStrArr.push('"' + temp + '"');
                    } else {
                        innerStrArr.push(temp);
                    }
                    let word2 = forword(true);
                    if (word2 === '' || endstrArr.includes(word2)) {
                        break;
                    } else {
                        innerStrArr.push(word2);
                        forword();
                    }
                }
                baseWord = new __runObj__(window, '', innerStrArr);
                for (let i = 0; i < innerStrArr.length; i++) {
                    if (innerStrArr[i] instanceof Obj) {
                        baseWord.listen(innerStrArr[i]);
                    }
                }
            }
            else if (typeof window[word] === 'function') {
                baseWord = functionCall(tableNum, word, baseWord, forAction, forword);
            }
            else {
                let matchObj = null;
                for (let i = 0; i < __allMatch__.length; i++) {
                    if (__allMatch__[i].func !== undefined && word.match(__allMatch__[i].match)) {
                        matchObj = functionCall(tableNum, __allMatch__[i].func, baseWord, forAction, forword);
                    } else if (word.match(__allMatch__[i].match)) {
                        matchObj = __allMatch__[i].value(tableNum, word, baseWord, function(endStrArrStep, extendParentEnd) {
                            if (extendParentEnd === false) {
                                return forAction(endStrArrStep);
                            } else {
                                return forAction(endstrArr.concat(endStrArrStep));
                            }
                        }, function(putback) {
                            let nextWord = forword(putback);
                            if (forwordStrNum > str.length) {
                                return undefined;
                            }
                            return nextWord;
                        }, function(putBack) {
                            let returnWord = str[forwordStrNum];
                            if (!putBack) {
                                forwordStrNum++;
                            }
                            return returnWord;
                        });
                        break;
                    }
                }
                if (matchObj === null) {
                    let isTableName = false;
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
        let codeLine = forAction('\n');
        if (codeLine !== null) {
            allAction.push(codeLine);
        }
        forword();
    }
    return allAction;
}
export default getEvalObj;
