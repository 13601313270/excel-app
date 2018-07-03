<template>
    <div>
        <template v-for="(item,index) in data">
            <div v-if="item.type==='text'">
                <p
                    :ref="'index'+index"
                    contenteditable
                    @focus="focus(index)"
                    @blur="item.value = $event.target.innerHTML.toString()"
                    @keyup="onkeyup"
                    @keydown="onkeydown"
                    v-html="item.value"></p>
            </div>
            <div v-else-if="item.type==='widget'">
                <widget></widget>
            </div>
        </template>
    </div>
</template>
<script>
import widget from '../widget.vue';
export default {
    props: [],
    data() {
        return {
            editorIndex: -1,
            editorText: '',
            focusPosition: -1,
            data: [{
                type: 'text',
                value: '阿斯蒂芬'
            }, {
                type: 'widget'
            }, {
                type: 'text',
                value: 'asdf'
            }]
        };
    },
    methods: {
        changeText(val, text) {
            val = text;
        },
        focus(index) {
            this.editorIndex = index;
        },
        onkeydown(event) {
            // console.log(event);
            this.focusPosition = window.getSelection().focusOffset;
            this.editorText = event.target.innerHTML.toString();
            if(event.key === 'Enter') {
                this.data.splice(this.editorIndex + 1, 0, {
                    type: 'text',
                    value: this.editorText.slice(this.focusPosition)
                });
                this.editorText = this.editorText.slice(0, this.focusPosition)
                event.preventDefault();
            } else if(event.key === 'ArrowLeft') {
                if(window.getSelection().focusOffset === 0) {
                    if(this.editorIndex > 0) {
                        this.editorIndex--;
                        let input = this.$refs['index' + this.editorIndex][0];
                        input.focus();
                        this.setCaretPositionEnd(input, 1);
                        event.preventDefault();
                    }
                }
            }
            // ArrowUp,ArrowDown
        },
        onkeyup(event) {
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
                        let input = this.$refs['index' + this.editorIndex][0];
                        input.focus();
                        this.setCaretPositionEnd(input, 0);
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
        },
        setCaretPositionEnd(ctrl, pos) {
            window.a = window.getSelection();
            window.getSelection().setPosition(ctrl, pos);
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

    .textarea {
        width: 100%;
        resize: none;
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        padding: 0;
        border: none;
        background-color: transparent;
    }
</style>