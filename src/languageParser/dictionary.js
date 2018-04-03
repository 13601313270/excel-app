/**
 * Created by ptmind on 2018/4/1.
 */
import Obj from '../observer/obj';
import __allMatch__ from './allMatch';
import createCodeText from './getStrByObj';
// 字典
class __dictionary__ extends Obj {
    constructor(value) {
        super();
        this.map = value;
        this.dom = document.createElement('div');
    }

    render() {
        console.log('render');
        console.log(this.value);
        this.dom.innerHTML = this.value;
    }

    get value() {
        let returnObj = {};
        for (let i in this.map) {
            let item = this.map[i];
            if (item instanceof Obj) {
                returnObj[i] = item.value;
            } else {
                returnObj[i] = item;
            }
        }
        return returnObj;
    }

    getCodeByObj() {
        let code = '{';
        let childArr = [];
        for (let i in this.map) {
            childArr.push(createCodeText(i) + ':' + createCodeText(this.map[i]));
        }
        code += childArr.join(',');
        code += '}';
        return code;
    }
}

__allMatch__.push({
    match: /^\{$/,
    type: 'dict',
    title: '字典',
    value(tableNum, word, befordWord, forAction, forword) {
        let params = {};
        let listenList = [];
        if (forword(true) === '}') {
            forword();
        } else {
            let limit = 0;
            while (limit++ < 10) {
                let key = forAction(':');
                forword();
                let value = forAction([',', ';', '}']);
                if (value instanceof Obj) {
                    listenList.push(value);
                }
                params[key] = value;
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
        let returnData = new __dictionary__(params);
        listenList.forEach(item => {
            returnData.listen(item);
        });
        return returnData;
    }
});
export default __dictionary__;
