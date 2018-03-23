/**
 * Created by ptmind on 2018/3/7.
 */
import Dep from './dep';
class obj {
    constructor() {
        this.dep = new Dep();
        this.dep.eventEmitter.on('ready', () => {
            this.render();
        });
        this.value_ = null;
    }

    listen(obj) {
        this.dep.listen(obj.dep);
    }

    render() {
    }
}
export default obj;
/**
 import obj from '@/tools/obj.js'
 var a = new obj();
 var b = new obj();
 b.value = 'i\'m b';
 console.log("====1======");
 a.value = b;// = 100;
 console.log("====2======");
 b.value = 111;// = 100;
 console.log("====3======");
 */
