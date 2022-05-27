const state = {
    selectedLines:[],
    currentLine:null
}

const getters = {
    getSelectedLines(state){
        return state.selectedLines
    },
    getCurrentLine(state){
        return state.currentLine
    }
}

const mutations = {
    setAddLineAction(state, data) {
        state.selectedLines=[]
        state.selectedLines.push(data);
    }
}

const actions = {
    addLineAction({ commit }, data) {
        if (data) {
            commit('setAddLineAction', { data })
            // console.log('stat3e',state.selectedLines)
        }
    },

}

export default {
    state, getters, mutations, actions
}