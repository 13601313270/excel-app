import Dep from './dep';
import Obj from './obj';
class Var extends Obj {
    get value() {
        if (this.value_ instanceof Obj) {
            return this.value_.value;
        } else {
            return this.value_;
        }
    }

    set value(varObj) {
        this.dep.lock();
        // 释放原有的监听
        if (this.value_ instanceof Obj) {
            this.dep.unListen(this.value_.dep);
            console.log(this.value_.destory());
        }
        this.value_ = varObj;
        if (varObj instanceof Obj) {
            this.listen(varObj);
        }
    }
}
class AllVarClass extends Dep {
    constructor() {
        super();
        this.allData = {};
    }

    setVar(key, val) {
        console.log('setVar');
        if (this.allData[key] === undefined) {
            this.allData[key] = new Var();
            this.allData[key].dep.on('ready', () => {
                this.eventEmitter.emit('ready', key, this.allData[key]);
            });
        }
        this.allData[key].codeText = val.codeText;
        this.allData[key].value = val;
        val.dep.update();
    }

    getAllData() {
        return this.allData;
    }

    getVar(key) {
        return this.allData[key];
    }
}
export default new AllVarClass();
