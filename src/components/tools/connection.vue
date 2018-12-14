<template>
    <div class="connection">
        <div class="tools">
            <ui-button @click="addConnection" size="mini">添加连接</ui-button>
        </div>
        <div class="list">
            <div class="header">
                <div class="name">名称</div>
                <div class="tool">操作</div>
            </div>
            <div v-for="item in allConn">
                <div class="name" v-html="item.name"></div>
                <div class="tool">
                    <ui-button @click="change(item)" size="mini">详情</ui-button>
                    <ui-button @click="deleteItem(item.id)" size="mini">删除</ui-button>
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
            allConn: this.connections,
            connectionConfig: {
                mysql: [
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
                        name: 'port',
                        default: 3306
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
                ]
            }
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
            dynamicForm(this.connectionConfig.mysql).then((data) => {
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
        change(item) {
            let update = Object.assign({}, item, item.info);
            dynamicForm(this.connectionConfig.mysql, update).then((data) => {
                console.log('=======');
                console.log(data);
                ajax({
                    type: 'POST',
                    url: 'http://www.tablehub.cn/action/connection.html',
                    data: {
                        id: item.id,
                        data: data
                    }
                }).then((data) => {
                    console.log('++++++');
                    console.log(data);
                    this.initList();
                });
            });
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
        .tools {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
        }
        .list {
            .header {
                font-size: 16px;
                font-weight: bold;
                border-top: solid 1px #b0b0b0;
                border-bottom: solid 2px #b0b0b0;
                line-height: 28px;
            }
            > div {
                font-size: 14px;
                display: flex;
                border-bottom: solid 1px #b0b0b0;
                height: 28px;
                padding: 5px 0;
                .name {
                    flex-grow: 1;
                    line-height: 28px;
                    padding-left: 5px;
                }
                .tool {
                    flex-shrink: 0;
                    width: 120px;
                }
            }
        }
    }
</style>