/**
 * Created by ptmind on 2018/4/1.
 */
import Obj from '../observer/obj';
import __allMatch__ from './allMatch';
import Var from '../observer/Var';
import createCodeText from './getStrByObj';
// 字典
class __dictionary__ extends Obj {
    constructor(value) {
        super();
        this.map = value;
    }

    get value() {
        return this.map;
    }

    getCodeByObj() {
        let code = '{';
        let childArr = [];
        this.map.forEach((item, key) => {
            childArr.push(createCodeText(key) + ':' + createCodeText(item));
        });
        code += childArr.join(',');
        code += '}';
        return code;
    }
}
class DictionaryGet extends Obj {
    constructor(dictionary, key) {
        super();
        this.dictionary = dictionary;
        this.key = key;
    }

    get value() {
        return this.dictionary.value.get(this.key);
    }

    getCodeByObj() {
        return this.dictionary.getCodeByObj() + '.' + this.key;
    }
}

__allMatch__.push({
    match: /^\{$/,
    type: 'dict',
    title: '字典',
    value(tableNum, word, befordWord, forAction, forword) {
        let params = new Map();
        if (forword(true) === '}') {
            forword();
        } else {
            let limit = 0;
            while (limit++ < 10) {
                let key = forAction(':');
                forword();
                let value = forAction([',', ';', '}']);
                params.set(key, value);
                let nextKey = forword(true);
                if (nextKey === undefined) {
                    break;
                } else if ([',', ';'].indexOf(nextKey) > -1) {
                    forword();
                } else if (nextKey === '}') {
                    forword();
                    break;
                }
            }
        }
        return new __dictionary__(params);
    }
});
__allMatch__.push({
    match: /^\.$/,
    type: 'dict',
    title: '字典',
    value(tableNum, word, befordWord, forAction, forword) {
        let before = befordWord;
        if (before instanceof Var) {
            before = before.value_;
        }
        if (before instanceof __dictionary__) {
            return new DictionaryGet(befordWord, forword());
        }
    }
});

export default __dictionary__;
