/**
 * Created by ptmind on 2018/3/7.
 */
class Dep {
    constructor(obj) {
        this.obj = obj;
        this.sentEvent = [];
        this.using = [];
        this.value_ = null;
        this.state = 0;// 0正常ready状态,1锁定,正在执行
    }

    listen(obj) {
        if (obj.sentEvent.indexOf(this) === -1) {
            obj.sentEvent.push(this);
            this.using.push(obj);
        }
    }

    // 不再监听某对象
    unListen(obj) {
        if (obj.sentEvent.length > 0) {
            for (let i = 0; i < obj.sentEvent.length; i++) {
                if (obj.sentEvent[i] === this) {
                    obj.sentEvent.splice(i, 1);
                    break;
                }
            }
        }
        if (this.using.length > 0) {
            for (let i = 0; i < this.using.length; i++) {
                if (this.using[i] === obj) {
                    this.using.splice(i, 1);
                    break;
                }
            }
        }
    }

    render() {
        this.obj.render();
    }

    lock() {
        this.state = 1;
        if (this.sentEvent instanceof Array && this.sentEvent.length > 0) {
            for (var i = 0; i < this.sentEvent.length; i++) {
                this.sentEvent[i].lock();
            }
        }
    }

    // 所有前置依赖是否state都是0
    __allBeforeIsState0() {
        var isReady = true;
        if (this.using.length > 0) {
            for (var i = 0; i < this.using.length; i++) {
                if (this.using[i].state === 1) {
                    isReady = false;
                }
            }
        }
        return isReady;
    }

    // 请求判断当前是否可以释放，如果可以则释放并通知下家
    __check() {
        // 当有多个上级的时候，会收到多个render，所以只捕捉最后一次
        if (this.__allBeforeIsState0()) {
            this.render();
            this.state = 0;
            if (this.sentEvent.length > 0) {
                this.sentEvent.forEach(i => i.__check());
            }
        }
    }
}
class obj {
    constructor() {
        this.dep = new Dep(this);
        this.dep.obj = this;
        this.value_ = null;
    }

    listen(obj) {
        this.dep.listen(obj.dep);
    }

    // 渲染
    render() {
        // this.dom.innerHTML = this.value;
        // console.log('-----render-----');
        // console.log(this);
        // console.log(this.value);
        // console.log(this.dep.sentEvent);
    }

    get value() {
        if (this.value_ instanceof obj) {
            return this.value_.value;
        } else {
            return this.value_;
        }
    }

    isYou(callBack) {
        this.dep.lock();
        // 释放原有的监听
        if (this.value_ instanceof obj) {
            this.dep.unListen(this.value_.dep);
        }
        var this_ = this;
        callBack(function(value) {
            this_.value_ = value;
            if (value instanceof obj) {
                this_.dep.listen(value.dep);
            }
            this_.dep.__check();// release
        });
    }

    set value(value) {
        this.isYou(function(finish) {
            finish(value);
        });
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
