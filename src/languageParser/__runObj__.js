/**
 * Created by ptmind on 2018/3/26.
 */
import Obj from '../observer/obj';
import createCodeText from './getStrByObj';
class __runObj__ extends Obj {
    constructor(runObj, funcName, params) {
        super();
        this.runObj = runObj;
        this.funcName = funcName;
        this.params = params;
        this.state = 0;// 0正常,1锁定
        // 如果是函数调用,则有函数名
        this.dom = document.createElement('div');
    }

    get value() {
        // 取值
        let runParams = [];
        for (let i = 0; i < this.params.length; i++) {
            let insert = this.params[i];
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
                return eval(runParams.join(''));
            } catch (e) {
                return '';
            }
        }
    }

    render() {
        this.dom.innerHTML = this.value;
    }

    getCodeByObj() {
        let code = '';
        if (this.funcName) {
            code += this.funcName + '(';
        }
        let runParams = [];
        for (let i = 0; i < this.params.length; i++) {
            let insert = this.params[i];
            if (insert instanceof Obj) {
                insert = createCodeText(insert);
            }
            runParams.push(insert);
        }
        code += runParams.join('');
        if (this.funcName) {
            code += ')';
        }
        return code;
    }
}
export default __runObj__;
