// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import vuexConfig from './vuex/index';
import ElementUI from 'element-ui';

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.config.productionTip = false;

let store = new Vuex.Store(vuexConfig);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
})
