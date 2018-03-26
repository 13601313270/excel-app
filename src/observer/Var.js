import Obj from './obj';
class Var extends Obj {
    constructor(name) {
        super();
        this.name = name;
    }

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
            this.value_.destory();
        }
        this.value_ = varObj;
        if (varObj instanceof Obj) {
            this.listen(varObj);
        }
    }
}
export default Var;
