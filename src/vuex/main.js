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
        }
    }
};
