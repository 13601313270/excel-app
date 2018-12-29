<template>
    <div class="connection">
        <div class="tools">
            <div style="position: relative">
                <ui-button @click="isChooseExist = !isChooseExist" size="mini">添加连接</ui-button>
                <ui-drop-list v-if="isChooseExist" style="position: absolute;top:30px;right: 0;">
                    <div v-for="item in dataSource" v-html="item.name" @click="addConnection(item.id)"></div>
                </ui-drop-list>
            </div>
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
import { mapActions, mapGetters } from 'vuex';
import { alert } from '../alert/alert';
import axios from 'axios';
// 读取文件内容
function getFile(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function(evt) {
            resolve(evt.target.result);
        }
    })
}
export default {
    props: {
        connections: {}
    },
    data() {
        return {
            allConn: this.connections,
            isChooseExist: false
        }
    },
    computed: {
        ...mapGetters('main', ['dataSource'])
    },
    methods: {
        ...mapActions('main', ['setConnections']),
        initList() {
            ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/action/connection.html',
                data: {
                    type: 'getConnections'
                }
            }).then((data) => {
                this.allConn = data.connection;
                this.setConnections(data.connection);
            });
        },
        async addConnection(dbTypeId) {
            this.isChooseExist = false;
            let column = this.dataSource.find(item => {
                return item.id === dbTypeId;
            });
            let defaultColumn = [{
                title: '名称',
                name: 'name'
            }];
            let connId = column.id;
            column = [...defaultColumn, ...column.column];
            let data = await dynamicForm(column);

            data.type = connId;
            let config = {
                headers: {'Content-Type': 'multipart/form-data'}
            };
            let param = new FormData();
            for (let i in data) {
                if(data[i] instanceof FileList) {
                    param.append(i, data[i][0], data[i][0].name);
                    var fileString = await getFile(data[i][0]);
                    fileString = fileString.replace(/\r\n/g, '\n').split('\n')[0].split(',');

                    fileString = fileString.filter(item => item !== '').map(item => {
                        return {
                            title: item,
                            name: item,
                            type: String,
                            enum: {
                                'number': '数字',
                                'string': '字符串'
                            },
                            default: 'string'
                        }
                    });
                    let dataTypeInfo = await dynamicForm(fileString);
                    param.append('dataTypeInfo', JSON.stringify(dataTypeInfo));
                } else {
                    param.append(i, data[i]);
                }
            }
            axios.put('http://www.tablehub.cn/action/mysql.html', param, config)
                .then(data => {
                    this.initList();
                });
        },
        change(item) {
            let typeId = parseInt(item.type);
            let update = Object.assign({}, item, item.info);
            console.log(item);
            let column = this.dataSource.find(item => {
                return item.id === typeId;
            });
            let defaultColumn = [{
                title: '名称',
                name: 'name'
            }];
            let connId = column.id;
            column = [...defaultColumn, ...column.column];
            dynamicForm(column, update).then((data) => {
                data.type = connId;
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
            alert('是否删除?').then(() => {
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