<template>
    <div style="padding: 10px;">
        <template v-for="(item,index) in data">
            <div
                v-show="dragDomFunc && (dragIndexPosition===index||dragIndexPosition===index-1)"
                class="addHangSplit"
                @drop="addData(index)"
                @dragover="$event.preventDefault()"
            ></div>
            <div v-if="item.type==='text'">
                <p
                    class="duanluo"
                    :ref="'index'+index"
                    contenteditable
                    @focus="focus(index)"
                    @blur="item.value = $event.target.innerHTML.toString()"
                    @keyup="onkeyup"
                    @keydown="onkeydown"
                    @dragover="dragWidgetOver(index)"
                    v-html="item.value"
                ></p>
            </div>
            <div
                v-else-if="item.type==='widget'"
                :ref="'widgetContent'+item.randomId"
            >
                <widget
                    contenteditable="false"
                    :data="item.data"
                    :random-id="item.randomId"
                    :ref="item.randomId"
                ></widget>
            </div>
        </template>
    </div>
</template>
<script>
import widget from '../widget.vue';
import widgetEvent from '../widgetChange';
export default {
    props: ['dragDomFunc'],
    data() {
        return {
            editorIndex: -1,
            editorText: '',
            focusPosition: -1,
            dragIndexPosition: -1,
            data: [{
                type: 'text',
                value: '正文'
            }]
        };
    },
    methods: {
        focus(index) {
            this.editorIndex = index;
        },
        onkeydown(event) {
            this.focusPosition = window.getSelection().focusOffset;
            this.editorText = event.target.innerHTML.toString();
            if(event.key === 'Enter') {
                this.data.splice(this.editorIndex + 1, 0, {
                    type: 'text',
                    value: this.editorText.slice(this.focusPosition)
                });
                this.editorText = this.editorText.slice(0, this.focudsPosition)
                event.preventDefault();
            } else if(event.key === 'ArrowLeft') {
                if(window.getSelection().focusOffset === 0) {
                    if(this.editorIndex > 0) {
                        this.editorIndex--;
                        if(this.data[this.editorIndex].type === 'text') {
                            let input = this.$refs['index' + this.editorIndex][0];
                            input.focus();
                            this.setCaretPositionEnd(input, 1);
                        }
                        event.preventDefault();
                    }
                }
            }
        },
        onkeyup(event) {
            if(this.editorIndex === this.data.length - 1) {
                if(this.editorText !== '') {
                    this.data.push({
                        type: 'text',
                        value: ''
                    });
                }
            }
            if(event.key === 'Enter') {
                this.$refs['index' + (this.editorIndex + 1)][0].focus();
                this.data[this.editorIndex - 1].value = this.editorText;
                event.preventDefault();
            } else if(event.key === 'Backspace') {
                if(this.data.length > 1 && this.editorIndex !== 0 && this.focusPosition === 0) {
                    let editorText = this.editorText;
                    this.data.splice(this.editorIndex, 1);
                    if(this.editorIndex > 0) {
                        this.editorIndex--;
                        let input = this.$refs['index' + this.editorIndex][0];
                        input.focus();
                        this.setCaretPositionEnd(input, 1);
                        this.data[this.editorIndex].value += editorText
                    }
                }
            } else if(event.key === 'ArrowRight') {
                if(this.focusPosition === window.getSelection().focusOffset) {
                    if(this.editorIndex < this.data.length - 1) {
                        this.editorIndex++;
                        if(this.data[this.editorIndex].type === 'text') {
                            let input = this.$refs['index' + this.editorIndex][0];
                            input.focus();
                            this.setCaretPositionEnd(input, 0);
                        }
                        event.preventDefault();
                    }
                }
            } else if(event.key === 'ArrowUp') {
                if(this.focusPosition === 0 || (window.getSelection().focusOffset === 0 && this.focusPosition !== 0)) {
                    if(this.editorIndex < this.data.length - 1) {
                        this.editorIndex--;
                        let input = this.$refs['index' + this.editorIndex][0];
                        input.focus();
                        this.setCaretPositionEnd(input, this.focusPosition);
                        event.preventDefault();
                    }
                }
            } else if(event.key === 'ArrowDown') {
                if(this.focusPosition === window.getSelection().focusOffset) {
                    if(this.editorIndex < this.data.length - 1) {
                        this.editorIndex++;
                        let input = this.$refs['index' + this.editorIndex][0];
                        input.focus();
                        this.setCaretPositionEnd(input, 0);
                        event.preventDefault();
                    }
                }
            }
            // document.execCommand("insertImage","false","https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png")
        },
        setCaretPositionEnd(ctrl, pos) {
            let Select = window.getSelection();
            if(pos === 1) {
                window.getSelection().setPosition(ctrl, Select.focusNode.parentNode.childNodes.length);
            } else {
                window.getSelection().setPosition(ctrl, pos);
            }
        },
        addData(index, e) {
            let randomId = 'r' + parseInt(Math.random() * 1000000);
            let varName = window.prompt('请输入名称', 'a7');
            varName = '$' + varName.replace(/^\$/, '');
            this.data.splice(index, 0, {
                type: 'widget',
                data: varName,
                randomId: randomId
            });
            if(varName !== null) {
                this.$nextTick(() => {
                    widgetEvent.emit('change', varName, randomId, this.$refs[randomId][0].$refs.content);
                });
            }
            console.log(e);
        },
        dragWidgetOver(index) {
            this.dragIndexPosition = index;
        }
    },
    components: {
        widget
    }
}
</script>
<style scoped lang="less">
    input:focus, textarea:focus, [contenteditable]:focus {
        outline: none;
    }

    .addHangSplit {
        height: 5px;
        background-color: rgb(229, 242, 255);
        border: solid 2px rgb(0, 0, 207);
    }

    .textarea {
        width: 100%;
        resize: none;
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        padding: 0;
        border: none;
        background-color: transparent;
    }

    .duanluo {
        /*border: solid 1px black;*/
    }
</style>