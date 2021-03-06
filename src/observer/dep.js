/**
 * Created by ptmind on 2018/3/22.
 */
const events = require('events');

class Dep {
    constructor() {
        this.eventEmitter = new events.EventEmitter();
        this.sentEvent = [];
        this.using = [];
        this.value_ = null;
        this.state = 0;// 0正常ready状态,1锁定
    }

    listen(obj) {
        if (obj.sentEvent.indexOf(this) === -1) {
            obj.sentEvent.push(this);
            this.using.push(obj);
        }
    }

    on(action, callback) {
        this.eventEmitter.on(action, callback);
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

    lock() {
        this.state = 1;
        if (this.sentEvent instanceof Array && this.sentEvent.length > 0) {
            for (let i = 0; i < this.sentEvent.length; i++) {
                this.sentEvent[i].lock();
            }
        }
    }

    // 所有前置依赖是否state都是0
    __allBeforeIsState0() {
        let isReady = true;
        if (this.using.length > 0) {
            for (let i = 0; i < this.using.length; i++) {
                if (this.using[i].state === 1) {
                    isReady = false;
                }
            }
        }
        return isReady;
    }

    action(actionType) {
        // 当有多个上级的时候，会收到多个render，所以只捕捉最后一次
        if (this.__allBeforeIsState0() && this.state === 1) {
            let result = [];
            this.eventEmitter.emit(actionType, (listenResult) => {
                result.push(listenResult);
            });
            let allPromise = [];
            let hasFalse = false;
            result.forEach((item) => {
                if (item === false) {
                    hasFalse = true;
                } else if (item instanceof Promise) {
                    allPromise.push(item);
                }
            });
            if (hasFalse) {
                this.state = 0;
                return;
            }
            if (allPromise.length > 0) {
                Promise.all(allPromise).then(() => {
                    this.state = 0;
                    if (this.sentEvent.length > 0) {
                        this.sentEvent.forEach(i => i.action(actionType));
                    }
                }).catch(() => {
                    this.state = 0;
                });
            } else {
                this.state = 0;
                if (this.sentEvent.length > 0) {
                    this.sentEvent.forEach(i => i.action(actionType));
                }
            }
        }
    }

    // 请求判断当前是否可以释放，如果可以则释放并通知下家
    update() {
        this.lock();
        this.action('ready');
    }

    // 当变为孤立点时，则会删除(sentEvent为空，说明不会再被任何对象使用)
    destory() {
        if (this.sentEvent.length === 0) {
            for (let i = 0; i < this.using.length; i++) {
                let temp = this.using[i];// 提前保存成变量temp，因为执行完unListen，this.using将重新排列
                this.unListen(temp);
                temp.destory();
            }
            this.eventEmitter.removeAllListeners('ready');
            return true;
        } else {
            // 有部分其余对象依赖于此对象，所以无法删除
            return false;
        }
    }
}

export default Dep;
