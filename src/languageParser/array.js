/**
 * Created by ptmind on 2018/3/28.
 */
import Obj from '../observer/obj';
import __allMatch__ from './allMatch';
class __array__ extends Obj {
    constructor(value) {
        super();
        this.value_ = value;
    }

    get value() {
        let result = [];
        this.value_.forEach((item) => {
            if (item instanceof Obj) {
                result.push(item.value);
            } else {
                result.push(item);
            }
        });
        return result;
    }
}
__allMatch__.push({
    match: /^\[$/,
    type: 'array',
    title: '数组',
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
        return new __array__(params);
    }
});
export default __array__;
