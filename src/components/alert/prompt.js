/**
 * Created by ptmind on 2018/9/21.
 */
import { createVueObj, deleteVueObj } from '../dynamicVueObject/dynamicVueObject';
import promptVue from './prompt.vue';

export function prompt(text, initValue) {
    return new Promise((resolve, reject) => {
        let dyVueObj = createVueObj(promptVue, {
            text,
            initValue
        }, {
            ok(res) {
                resolve(res);
                deleteVueObj(dyVueObj);
            },
            cancel() {
                reject('cancel');
                deleteVueObj(dyVueObj);
            }
        });
    });
}