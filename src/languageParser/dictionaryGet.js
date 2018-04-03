/**
 * Created by ptmind on 2018/4/1.
 */
import Obj from '../observer/obj';
import __allMatch__ from './allMatch';
import Var from '../observer/Var';
// 字典
class DictionaryGet extends Obj {
    constructor(dictionary, key) {
        super();
        this.dictionary = dictionary;
        this.key = key;
        this.dom = document.createElement('div');
    }

    render() {
        this.dom.innerHTML = this.value;
    }

    get value() {
        let list = this.dictionary;
        if (list instanceof Obj) {
            list = list.value;
        }
        let value = list[this.key];
        return value;
    }

    getCodeByObj() {
        return this.dictionary.getCodeByObj() + '.' + this.key;
    }
}

__allMatch__.push({
    match: /^\.$/,
    type: 'dictGet',
    name: 'dictGet',
    title: '字典获取',
    value(tableNum, word, befordWord, forAction, forword) {
        let before = befordWord;
        if (before instanceof Var) {
            before = before.value_;
        }

        if (before instanceof Obj) {
            let returnData = new DictionaryGet(befordWord, forword());
            returnData.listen(befordWord);
            return returnData;
        }
    }
});

export default DictionaryGet;
