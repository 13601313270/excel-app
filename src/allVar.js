import Obj from './obj';
class AllVarClass extends Obj {
    constructor() {
        super();
        this.value_ = {};
    }

    setVar(key, val) {
        this.value_[key] = val;
        val.notify(this);
        this.__check();
    }

    getVar(key) {
        return this.value_[key];
    }
}
export default new AllVarClass();
