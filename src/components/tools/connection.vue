<template>
    <div class="connection">
        <ui-button @click="addConnection" size="mini">添加连接</ui-button>
        <div class="list">
            <div v-for="item in allConn">
                <div class="name" v-html="item.name"></div>
                <div class="tool">
                    <ui-button @click="change(item)" size="mini">修改</ui-button>
                    <ui-button @click="deleteItem(item.id)" size="mini">删除</ui-button>
                </div>

                <div style="display: none">
                    <div v-html="item.id"></div>
                    <div v-html="item.uid"></div>
                    <div v-html="item.type"></div>
                    <div v-html="item.info.db"></div>
                    <div v-html="item.info.host"></div>
                    <div v-html="item.info.port"></div>
                    <div v-html="item.info.username"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ptWindow from '../ui/window.vue';
import popup from '../ui/popup.vue';
import dynamicForm from '../dynamicForm/form';
import ajax from '../../api/ajax';
import { mapActions } from 'vuex';
import { alert } from '../alert/alert';
export default {
    props: {
        connections: {}
    },
    data() {
        return {
            allConn: this.connections
        }
    },
    methods: {
        ...mapActions('main', ['setConnections']),
        initList() {
            ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/action/mysql.html',
                data: {
                    type: 'getConnections'
                }
            }).then((data) => {
                this.allConn = data;
                this.setConnections(data);
            });
        },
        addConnection() {
            dynamicForm([
                {
                    title: '名称',
                    name: 'name'
                },
                {
                    title: '类型',
                    name: 'type',
                    enum: {
                        '2': 'mysql'
                    }
                },
                {
                    title: 'host',
                    name: 'host'
                },
                {
                    title: '端口',
                    type: Number,
                    name: 'port'
                },
                {
                    title: '用户名',
                    name: 'username'
                },
                {
                    title: '密码',
                    name: 'password'
                },
                {
                    title: 'db',
                    name: 'db'
                }
            ]).then((data) => {
                console.log('=======');
                console.log(data);
                ajax({
                    type: 'PUT',
                    url: 'http://www.tablehub.cn/action/mysql.html',
                    data: data
                }).then((data) => {
                    console.log('++++++');
                    console.log(data);
                    this.initList();
                });
            });
        },
        change(id) {

        },
        deleteItem(id) {
            alert('是否删除').then(() => {
                ajax({
                    type: 'DELETE',
                    url: 'http://www.tablehub.cn/action/mysql.html',
                    data: {id}
                }).then((data) => {
                    console.log('++++++');
                    console.log(data);
                    this.initList();
                });
            });
        }
    },
    components: {
        ptWindow, popup
    },
    watch: {
        connections(val) {
            this.allConn = val;
        }
    }
}
</script>
<style scoped lang="less">
    .connection {
        padding: 5px;
        .list {
            > div {
                display: flex;
                border-bottom: solid 1px #b0b0b0;
                padding: 5px 0;
                .name {
                    flex-grow: 1;
                }
                .tool {
                    flex-shrink: 0;
                    width: 120px;
                }
            }
        }
    }
</style>