import Dep from './observer/dep';
class AllVarClass extends Dep {
    constructor() {
        super();
        this.allData = {};
    }

    setVar(key, val) {
        this.allData[key] = val;
        this.listen(this.allData[key].dep);
        this.allData[key].dep.on('ready', () => {
            this.eventEmitter.emit('ready', key, this.allData[key]);
        });
        this.allData[key].dep.update();
    }

    getAllData() {
        return this.allData;
    }

    start() {
        for (let i in this.allData) {
            this.allData[i].dep.update();
        }
    }

    getVar(key) {
        return this.allData[key];
    }
}
export default new AllVarClass();
