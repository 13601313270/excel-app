import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index';
import ui from '@/components/ui';
import app from '@/components/app.vue';

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
        }, {
            path: '/app/:appType/:fileId/page',
            name: 'app',
            component: app
        }
    ]
});
