/**
 * Created by ptmind on 2018/3/10.
 */
import widget from './widget.vue';
export default function() {
    return {
        data() {
            return {};
        },
        components: {
            widget
        },
        methods: {
            addData(id, dom) {
                this.$emit('addData', id, dom);
            }
        },
        mounted() {
        },
        template: `<div>
    <div>
        <div style="border: solid 1px black;"><widget></widget></div>
        <widget></widget>
        <widget></widget>
        <widget></widget>
        <widget></widget>
    </div>
</div>`
    };
}
