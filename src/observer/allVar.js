import Dep from './dep';
import Obj from './obj';
import Var from './Var';

class AllVarClass extends Dep {
    constructor() {
        super();
        this.allData = {};
    }

    setVar(key, val) {
        if(this.allData[key] === undefined) {
            this.allData[key] = new Var(key);
            // 如果每一个变量都被AllVarClass对象listen，则对象的Dep无法删除，因为删除的限制是没有其他对象listen对象的Dep
            // this.listen(this.allData[key].dep);
            this.allData[key].dep.on('ready', () => {
                this.eventEmitter.emit('valChange', key, this.allData[key]);
            });
        }
        this.allData[key].value = val;
        if(val instanceof Obj) {
            val.dep.update();
        } else {
            this.allData[key].dep.update();
        }
    }

    getAllData() {
        return this.allData;
    }

    getVar(key) {
        return this.allData[key];
    }

    deleteVar(key) {
        let varObj = this.getVar(key);
        let varEqualObj = varObj.value_;
        if(varObj.dep.sentEvent.length === 0) {
            varObj.dep.destory();
            delete varObj.dep;
            delete this.allData[key];
            if(varEqualObj.dep) {
                varEqualObj.dep.destory();
                delete varEqualObj.dep;
            }
            return true;
        } else {
            return false;
        }
    }

    clear() {
        this.allData = {};
    }
}

export default new AllVarClass();
