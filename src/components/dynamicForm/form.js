/**
 * Created by ptmind on 2018/12/6.
 */
import { createVueObj, deleteVueObj } from '../dynamicVueObject/dynamicVueObject';
import form from './form.vue';

export default function(inputProps, initData = {}) {
    return new Promise((resolve, reject) => {
        let dyVueObj = createVueObj(form, {
            inputProps, initData
        }, {
            save(res) {
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
