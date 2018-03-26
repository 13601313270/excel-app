import Dep from './dep';
import Obj from './obj';
import Var from './Var';
class AllVarClass extends Dep {
    constructor() {
        super();
        this.allData = {};
    }

    setVar(key, val) {
        if (this.allData[key] === undefined) {
            this.allData[key] = new Var(key);
            this.listen(this.allData[key].dep);
            this.allData[key].dep.on('ready', () => {
                this.eventEmitter.emit('valChange', key, this.allData[key]);
            });
        }
        this.allData[key].codeText = val.codeText;
        this.allData[key].value = val;
        if (val instanceof Obj) {
            val.dep.update();
        } else {
            if (typeof val === 'number') {
                this.allData[key].codeText = val;
            } else if (typeof val === 'string') {
                this.allData[key].codeText = '"' + val + '"';
            }
            this.allData[key].dep.update();
        }
    }

    getAllData() {
        return this.allData;
    }

    getVar(key) {
        return this.allData[key];
    }
}
export default new AllVarClass();
