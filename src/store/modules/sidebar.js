
const state = {
    sidebarOpen:true,
    activeSideBar : 'filesystem'
}

const getters = {
    getActiveSideBar(state){
        return state.activeSideBar
    }
}

const mutations = {
    setActiveSideBar(state, data){
        state.activeSideBar = data
    }
}

const actions = {
    changeActiveSideBar({commit}, data){
        commit('setActiveSideBar', data)
    }
}

export default {
    state, getters, mutations, actions
}