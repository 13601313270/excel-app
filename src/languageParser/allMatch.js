/**
 * Created by ptmind on 2018/3/8.
 */
import allVar from '../observer/allVar';
import Var from '../observer/Var';
import Obj from '../observer/obj';

var __allMatch__ = [
    {
        match: /^-?\d+$/,
        type: 'number',
        title: '数字',
        name: 'number',
        value: function(tableNum, word, baseWord, forAction, forWord, forCharacter) {
            if (forWord(true) === '.') {
                forWord();
                if (forWord(true).match(/^\d+$/)) {
                    word += '.' + forWord(true);
                    forWord();
                }
            }
            return parseFloat(word);
        }
    },
    {
        match: /^'|"$/,
        type: 'string',
        title: '字符串',
        name: 'string',
        value: function(tableNum, word, baseWord, forAction, forWord, forCharacter) {
            let strTemp = '';
            let s = 0;
            while (s++ < 10000) {
                let nextCharacter = forCharacter();
                if (nextCharacter === word) {
                    if (strTemp.substr(strTemp.length - 1) !== '\\') {
                        break;
                    }
                }
                strTemp += nextCharacter;
            }
            return strTemp;
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
            // console.log(befordWord);
            if (befordWord instanceof Var) {
                let varObj = forAction(['\n', ';']);
                allVar.setVar(befordWord.name, varObj);
            } else if (befordWord instanceof Obj) {
                befordWord.value = forAction(['\n', ';']);
            } else {
                befordWord.value = 'hear 开发中 test';
            }
            return befordWord;
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
