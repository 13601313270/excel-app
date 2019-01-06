<template>
    <div class="connection">
        <div class="tools">
            <div style="position: relative">
                <ui-button @click="isChooseExist = !isChooseExist" size="mini">添加连接</ui-button>
                <ui-drop-list v-if="isChooseExist" style="position: absolute;top:30px;right: 0;width: 150px;">
                    <div v-for="item in dataSource" v-html="item.title" @click="addConnection(item.id)"></div>
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
        <popupBackground class="write_column" v-if="isWriteColumn">
            <ui-window @close="cancelWriteColumn">
                <div style="display: flex; border-bottom: solid 1px #afafaf;margin-bottom: 10px;padding-bottom: 10px;">
                    <span style="line-height: 28px;color:#404040">名称： </span>
                    <ui-input size="mini" v-model="writeColumnName"></ui-input>
                </div>
                <span style="line-height: 28px;color:#404040">结构： </span>
                <div class="item" v-for="(item,key) in writeColumnList">
                    <ui-input size="mini" v-model="item.name"></ui-input>
                    <ui-select size="mini" v-model="item.type" style="width: 70px">
                        <option value="number">数字</option>
                        <option value="string">文字</option>
                        <option value="bool">布尔</option>
                        <option value="date">日期</option>
                        <option value="time">时间</option>
                        <option value="datetime">日期+时间</option>
                    </ui-select>
                    <ui-button
                        size="mini"
                        icon="&#xe64d;"
                        style="padding-right: 2px!important;"
                        v-if="writeColumnList.length>1"
                        @click="writeColumnList.splice(key,1)"></ui-button>
                </div>
                <ui-button @click="writeColumnList.push({name: '',type: 'string'})" size="mini">添加</ui-button>
                <br/>
                <div
                    style="width: 100%;border-top: solid 1px #afafaf;padding-top: 10px;margin-top: 10px;display: flex;justify-content: center;">
                    <ui-button @click="saveColumn">保存</ui-button>
                </div>
            </ui-window>
        </popupBackground>
    </div>
</template>
<script>
import popup from '../ui/popup.vue';
import dynamicForm from '../dynamicForm/form';
import ajax from '../../api/ajax';
import { mapActions, mapGetters } from 'vuex';
import { alert } from '../alert/alert';
import axios from 'axios';
import popupBackground from '../ui/popupBackground.vue';
import UiInput from '../ui/input';
import UiButton from '../ui/button';
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
            isWriteColumn: false,
            writeColumnName: '',
            writeColumnList: [{
                name: '',
                type: 'string'
            }],
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
            if(dbTypeId === 5) {
                this.isWriteColumn = true;
            } else {
                let column = this.dataSource.find(item => {
                    return item.id === dbTypeId;
                });
                let defaultColumn = [{
                    title: '名称',
                    name: 'name'
                }];
                let connId = column.id;
                if(column.column.length === 1 && column.column[0].type === 'token') {
                    window.open(column.column[0].tokenUrl);
                } else {
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
                }
            }
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
        },
        cancelWriteColumn() {
            this.isWriteColumn = false;
        },
        saveColumn() {
            let config = {
                headers: {'Content-Type': 'multipart/form-data'}
            };
            let param = new FormData();
            param.append('name', this.writeColumnName);
            param.append('type', 5);
            param.append('column', JSON.stringify(this.writeColumnList));
            this.cancelWriteColumn();
            axios.put('http://www.tablehub.cn/action/mysql.html', param, config)
                .then(data => {
                    this.initList();
                });
        }
    },
    components: {
        UiButton,
        UiInput,
        popup,
        popupBackground
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
        .write_column {
            display: flex;
            justify-content: center;
            align-items: center;
            .item {
                /*display: inline-block;*/
            }
        }
    }
</style>