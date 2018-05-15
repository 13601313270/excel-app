import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index';
import ui from '@/components/ui';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: index
        }, {
            path: '/ui/',
            name: 'UI',
            component: ui
        }
    ]
});
