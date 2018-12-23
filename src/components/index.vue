<template>
    <div class="content">
        <div style="background-color: #3c3f41;border-bottom: solid 1px #4f4f4f;">tablehub</div>
        <div class="app_list">
            <h1>数据软件列表</h1>
            <div class="list">
                <div @click="chooseApp('word')">
                    <div class="panel-heading">文稿</div>
                </div>
                <div @click="chooseApp('excel')">
                    <div class="panel-heading">表格</div>
                </div>
                <div @click="chooseApp('freePanel')">
                    <div class="panel-heading">黑板</div>
                </div>
                <div @click="chooseApp('ppt')">
                    <div class="panel-heading">演示文稿</div>
                </div>
                <div @click="chooseApp('test')">
                    <div class="panel-heading">测试</div>
                </div>
                <div v-for="item in dashboardTemplate" @click="chooseApp(item.id)">
                    <div class="panel-heading" v-html="item.title"></div>
                </div>
            </div>
        </div>
        <!--文件选择-->
        <div v-if="isChooseFile" class="choose_file">
            <ui-window class="body" @close="closeChooseFile" title="选择app的记录">
                <template v-for="item in fileList">
                    <ui-window
                        class="file_item"
                        :key="item.id"
                        @click.native="selectFile(item)"
                        :title="item.title"
                        @close="deleteFile(item.id)"
                    >
                        asdfsda
                    </ui-window>
                </template>
                <div @click="createFile" class="file_item"
                     style="background-color: #dce4e4;text-align: center;padding-top: 50px;box-sizing: border-box;">新建
                </div>
            </ui-window>
        </div>
    </div>
</template>

<script>
import headerNav from './head.vue';
import ajax from '../api/ajax';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            dashboardTemplate: [
                {
                    id: 1,
                    name: 'useFile',
                    title: '保存测试'
                }
            ],
            connections: [],
            // 是否弹出选择文件界面
            isChooseFile: false,
            // 选择的app类型
            appType: '',
            fileList: [],
            // 保存的文件
            fileData: {}
        }
    },
    methods: {
        ...mapActions('main', ['setConnections']),
        closeChooseFile() {
            this.isChooseFile = false;
            this.appType = '';
        },
        chooseApp(appType) {
            ajax({
                type: 'GET',
                url: 'http://www.tablehub.cn/app/file.html',
                data: {
                    appType: appType
                }
            }).then((data) => {
                this.isChooseFile = true;
                this.fileList = data;
                this.appType = appType;
                console.log(data);
            });
        },
        createFile() {
            let fileName = window.prompt('请输入文件名', '未命名文件');
            ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/app/file.html',
                data: {
                    appType: this.appType,
                    title: fileName
                }
            }).then((data) => {
                this.chooseApp(this.appType);
            });
        },
        selectFile(file) {
            this.$router.push({
                name: 'app',
                params: {
                    appType: this.appType,
                    fileId: file.id,
                    data: file
                }
            });
        },
        deleteFile(id) {
            ajax({
                type: 'DELETE',
                url: 'http://www.tablehub.cn/app/file.html',
                data: {
                    id: id
                }
            }).then((data) => {
                this.chooseApp(this.appType);
            });
        }
    },
    mounted() {
        ajax({
            type: 'POST',
            url: 'http://www.tablehub.cn/action/connection.html',
            data: {
                type: 'getConnections'
            }
        }).then((data) => {
            this.connections = data.connection;
            this.setConnections(data.connection);
        });
        /*
         ajax({
         type: 'POST',
         url: 'http://www.tablehub.cn/action/mysql.html',
         data: {
         type: 'showCreateTable',
         connection: 1,
         table: 'excel'
         }
         }).then((data) => {
         console.log(data);
         });
         */
    },
    components: {
        'header-nav': headerNav
    }
}
</script>
<style scoped lang="less">
    @import "./ui/basic";
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .content {
        width: 100%;
        height: 100%;
        min-width: 930px;
        display: flex;
        flex-direction: column;
        .app_list {
            display: flex;
            flex-wrap: wrap;
            padding: 15px;
            .list > * {
                .ui_list_item;
                flex-shrink: 0;
                float: left;
                width: 300px;
                height: 220px;
                margin: 0 10px 20px 10px;
                background-color: #fff;
                border: 1px solid #ddd;
                overflow: hidden;
                border-radius: 4px;
                box-sizing: border-box;
                -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
                box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
                .panel-heading {
                    padding: 10px 15px;
                    border-bottom: solid 1px #ddd;
                    background-color: #f5f5f5;
                }
            }
        }
    }

    .choose_file {
        width: 100%;
        height: 100%;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        .body {
            width: 662px;
            height: 500px;
            background-color: white;
            box-shadow: 1px 1px 400px -40px #5c5c5c;
            .file_item {
                .ui_list_item;
                float: left;
                width: 200px;
                height: 130px;
                margin: 0 5px 20px 5px;
            }
        }
    }
</style>
