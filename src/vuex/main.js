export default {
    state: {
        varHighlight: {},
        connections: []
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
