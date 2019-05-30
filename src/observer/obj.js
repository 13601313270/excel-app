/**
 * Created by ptmind on 2018/3/7.
 */
import Dep from './dep';
class obj {
    constructor() {
        this.dep = new Dep();
        this.dep.on('ready', (handle) => {
            if(this.check()) {
                this.render(handle);
            }
        });
        this.value_ = null;
    }

    listen(obj) {
        this.dep.listen(obj.dep);
    }

    render() {
    }

    destory() {
        this.dep.destory();
    }

    check() {
        return true;
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
