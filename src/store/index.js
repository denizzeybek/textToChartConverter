import Vue from 'vue'
import Vuex from 'vuex'
import sideBar from './modules/sidebar'
import fileExplorer from './modules/fileExplorer'
import monacoEditor from './modules/monacoEditor'
import codeFlow from './modules/codeFlow'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    sideBar,
    fileExplorer,
    monacoEditor,
    codeFlow
  }
})
