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

    // 渲染
    render() {
    }

    get value() {
        if (this.value_ instanceof obj) {
            return this.value_.value;
        } else {
            return this.value_;
        }
    }

    set value(value) {
        this.dep.lock();
        // 释放原有的监听
        if (this.value_ instanceof obj) {
            this.dep.unListen(this.value_.dep);
        }
        this.value_ = value;
        if (value instanceof obj) {
            this.dep.listen(value.dep);
        }
        this.dep.__check();// release
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
