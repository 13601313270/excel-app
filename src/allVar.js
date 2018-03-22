import Dep from './observer/dep';
class AllVarClass extends Dep {
    constructor() {
        super();
        this.allData = {};
    }

    setVar(key, val) {
        this.allData[key] = val;
        this.listen(this.allData[key].dep);
        this.allData[key].dep.__check();
    }

    getAllData() {
        return this.allData;
    }

    start() {
        for (let i in this.allData) {
            this.allData[i].dep.__check();
        }
    }

    getVar(key) {
        return this.allData[key];
    }
}
export default new AllVarClass();
