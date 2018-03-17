/**
 * Created by ptmind on 2018/3/7.
 */
import Obj from './obj';
export default class extends Obj {
    constructor() {
        super();
        this.props = Array.from(arguments);
        this.type = 'function';
    }
}
