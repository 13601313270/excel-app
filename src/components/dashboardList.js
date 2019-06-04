export default [
    {
        id: 1,
        name: 'useFile',
        title: '保存测试',
        components: () => import(/* webpackChunkName: "login" */ './dashboard/useFile.vue'),
    },
    {
        id: 2,
        name: 'word',
        title: '文稿',
        components: () => import(/* webpackChunkName: "login" */ './dashboard/word.vue'),
    },
    {
        id: 3,
        name: 'excel',
        title: '表格',
        components: () => import(/* webpackChunkName: "login" */ './dashboard/excel.vue'),
    },
    {
        id: 4,
        name: 'freePanel',
        title: '黑板',
        components: () => import(/* webpackChunkName: "login" */ './dashboard/freePanel.vue'),
    },
    {
        id: 5,
        name: 'ppt',
        title: '演示文稿',
        components: () => import(/* webpackChunkName: "login" */ './dashboard/ppt.vue'),
    }
];
