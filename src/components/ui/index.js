/**
 * Created by ptmind on 2018/12/11.
 */
import button from './button.vue';
import window from './window.vue';
import input from './input.vue';
import dropList from './dropList.vue';
const ptUI = [button, window, input, dropList];
export default {
    install(Vue) {
        ptUI.forEach(component => {
            Vue.component(component.name, component);
        });
    }
};
