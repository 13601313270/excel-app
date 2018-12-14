/**
 * Created by ptmind on 2018/9/21.
 */
import { createVueObj, deleteVueObj } from '../dynamicVueObject/dynamicVueObject';
import alertVue from './alert.vue';

export function alert(text) {
    return new Promise((resolve, reject) => {
        let dyVueObj = createVueObj(alertVue, {
            text
        }, {
            ok(res) {
                resolve(res);
                deleteVueObj(dyVueObj);
            },
            cancel() {
                reject();
                deleteVueObj(dyVueObj);
            }
        });
    });
}
