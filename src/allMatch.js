/**
 * Created by ptmind on 2018/3/8.
 */
import allVar from './allVar';
import Obj from './obj';
var __allMatch__ = [
    {
        match: /^-?\d+$/,
        type: 'number',
        title: '数字',
        name: 'number',
        value: function(tableNum, word, baseWord, forAction, forword) {
            if (forword(true) === '.') {
                forword();
                if (forword(true).match(/^\d+$/)) {
                    word += '.' + forword(true);
                    forword()
                }
            }
            return parseFloat(word);
        }
    },
    {
        match: /^TRUE|true$/,
        type: 'bool',
        name: 'TRUE',
        title: '真(是)',
        value: function(tableNum, word) {
            return true;
        }
    },
    {
        match: /^FALSE|false/,
        type: 'bool',
        name: 'FALSE',
        title: '假(否)',
        value: function(tableNum, word) {
            return false;
        }
    },
    {
        // match: /^\$[A-Z|a-z|\d]+$/,
        match: /^\$[\S]+$/,
        type: 'var',
        title: '变量',
        value(tableNum, word, baseWord) {
            if (allVar.getVar(word) === undefined) {
                allVar.setVar(word, new Obj());
            }
            return allVar.getVar(word);
        }
    },
    {
        match: /^=$/,
        value(tableNum, word, befordWord, forAction) {
            if (befordWord instanceof Obj) {
                befordWord.value = forAction(['\n', ';']);
            } else {
                befordWord.value = 'hear 开发中 test';
            }
            return befordWord;
        }
    },
    {
        match: /^\[$/,
        value(tableNum, word, befordWord, forAction, forword) {
            var params = [];
            if (forword(true) === ']') {
                forword();
            } else {
                let lll = 0;
                while (lll++ < 4) {
                    params.push(forAction([',', ';', ']']));
                    var nextKey = forword(true);
                    if (nextKey === undefined) {
                        break;
                    } else if ([',', ';'].indexOf(nextKey) > -1) {
                        forword();
                    } else if (nextKey === ']') {
                        forword();
                        break;
                    }
                }
            }
            return params;
        }
    },
    {
        match: /^\($/,
        value(tableNum, word, baseWord, forAction, forword) {
            let returnBase = forAction([')'], false);
            forword();
            return returnBase;
        }
    }

];
export default __allMatch__;
