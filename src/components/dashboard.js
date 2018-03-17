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
        mounted() {
        },
        template: `<div>
    <div>
        <div style="border: solid 1px black;"><widget data="$a2"></widget></div>
        <widget data="$a1"></widget>
        <widget></widget>
        <widget></widget>
        <widget></widget>
    </div>
</div>`
    }
}
