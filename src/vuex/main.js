import Vue from 'vue';
export default {
    namespaced: true,
    state: {
        varHighlight: {},
        connections: [],
        dataSource: [],
        editObjArr: [],
        widgetIdToVar: {},
        dragDomFunc: null,
        isEditing: false
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
        },
        setDragDomFunc(state, data) {
            state.dragDomFunc = data;
        },
        setWidgetIdToVar(state, data) {
            state.widgetIdToVar = data;
        },
        clearWidgetIdToVar(state) {
            state.widgetIdToVar = {};
        },
        deleteWidgetIdToVar(state, key) {
            Vue.delete(state.widgetIdToVar, key);
        },
        setIsEditing(state, data) {
            state.isEditing = data;
        },
        dataSourceSet(state, data) {
            state.dataSource = data;
        }
    },
    actions: {
        varHighlightSet({commit}, data) {
            return commit('varHighlightSet', data);
        },
        setConnections({commit}, data) {
            return commit('setConnections', data);
        },
        editObjArrPush({commit}, data) {
            return commit('editObjArrPush', data);
        },
        editObjArrPop({commit}, data) {
            return commit('editObjArrPop', data);
        },
        setDragDomFunc({commit}, data) {
            return commit('setDragDomFunc', data);
        },
        setWidgetIdToVar({commit}, data) {
            return commit('setWidgetIdToVar', data);
        },
        clearWidgetIdToVar({commit}, data) {
            return commit('clearWidgetIdToVar', data);
        },
        deleteWidgetIdToVar({commit}, key) {
            return commit('deleteWidgetIdToVar', key);
        },
        setIsEditing({commit}, data) {
            return commit('setIsEditing', data);
        },
        setDataSourceSet({commit}, data) {
            return commit('dataSourceSet', data);
        }
    },
    getters: {
        connections: state => state.connections,
        varHighlight: state => state.varHighlight,
        editObjArr: state => state.editObjArr,
        dragDomFunc: state => state.dragDomFunc,
        widgetIdToVar: state => state.widgetIdToVar,
        isEditing: state => state.isEditing,
        dataSource: state => state.dataSource
    }
};
