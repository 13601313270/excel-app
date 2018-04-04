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
        editObjArrPop(state, key) {
            state.editObjArr.pop(key);
        }
    }
};
