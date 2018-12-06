/**
 * Created by ptmind on 2018/12/6.
 */
import { createVueObj, deleteVueObj } from '../dynamicVueObject/dynamicVueObject';
import form from './form.vue';

export default function(inputPropts) {
    return new Promise((resolve, reject) => {
        let dyVueObj = createVueObj(form, {
            inputPropts
        }, {
            save(res) {
                deleteVueObj(dyVueObj);
                resolve(res);
            },
            cancel() {
                deleteVueObj(dyVueObj);
                reject(new Error('cancel'));
            }
        });
    });
}
