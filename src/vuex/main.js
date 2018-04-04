export default {
    state: {
        varHighlight: {},
        connections: [],
        editObjArr: []
    },
    mutations: {
        varHighlightSet(state, data) {
            state.varHighlight = data;
        },
        setConnections(state, data) {
            state.connections = data;
        },
        editObjArrPush(state, item) {
            state.editObjArr.push(item);
        },
        editObjArrDelete(state, key) {
            state.editObjArr.splice(key, 1);
        }
    }
};
