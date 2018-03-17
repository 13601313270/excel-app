/**
 * Created by ptmind on 2018/3/7.
 */
class obj {
    constructor() {
        this.className = '';
        this.sentEvent = [];
        this.using = [];
        this.value_ = null;
        // this.dom = document.createElement('div');
        // 0正常ready状态,1锁定,正在执行
        this.state = 0;
    }

    // 绑定本对象修改后会影响的其他对象
    listen(obj) {
        if (this.sentEvent.indexOf(obj) === -1) {
            this.sentEvent.push(obj);
            obj.using.push(this);
        }
    }

    unListen(obj) {
        if (this.sentEvent.length > 0) {
            for (let i = 0; i < this.sentEvent.length; i++) {
                if (this.sentEvent[i] === obj) {
                    this.sentEvent.splice(i, 1);
                    break;
                }
            }
        }
        if (obj.using.length > 0) {
            for (let i = 0; i < obj.using.length; i++) {
                if (obj.using[i] === this) {
                    obj.using.splice(i, 1);
                    break;
                }
            }
        }
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

    // 渲染
    render() {
        // this.dom.innerHTML = this.value;
        // console.log('-----render-----');
        // console.log(this);
        // console.log(this.value);
        // console.log(this.sentEvent);
    }

    // 请求判断当前是否可以释放，如果可以则释放并通知下家
    // 当有多个上级的时候，会收到多个render
    __check() {
        if (this.__allBeforeIsState0()) {
            this.render();
            this.state = 0;
            if (this.sentEvent.length > 0) {
                this.sentEvent.forEach(i => i.__check());
            }
        }
    }

    get value() {
        if (this.value_ instanceof obj) {
            return this.value_.value;
        } else {
            return this.value_;
        }
    }

    isYou(callBack) {
        this.lock();
        // 释放原有的监听
        if (this.value_ instanceof obj) {
            this.value_.unListen(this);
        }
        var this_ = this;
        callBack(function(value) {
            this_.value_ = value;
            if (value instanceof obj) {
                value.listen(this_);
            }
            this_.__check();// release
        })
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
