/**
 * Created by ptmind on 2018/3/7.
 */
import Obj from '../observer/obj';
export default class extends Obj {
    constructor() {
        super();
        this.props = Array.from(arguments);
        this.type = 'function';
        this.dom = document.createElement('div');
    }

    render() {
        this.dom.innerHTML = this.value;
    }
}
