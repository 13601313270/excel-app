/**
 * Created by ptmind on 2018/9/21.
 */
import {createVueObj, deleteVueObj} from '../dynamicVueObject/dynamicVueObject';
import promptVue from './prompt.vue';

export function prompt(text, initValue, check) {
    return new Promise((resolve, reject) => {
        let dyVueObj = createVueObj(promptVue, {
            text,
            initValue,
            check
        }, {
            ok(res) {
                deleteVueObj(dyVueObj);
                resolve(res);
            },
            cancel() {
                deleteVueObj(dyVueObj);
                reject();
            }
        });
    });
}
