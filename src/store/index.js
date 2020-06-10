import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    height: null,
  },
  mutations: {
    setInfo(state, payload) {
      state.height = payload.height;
    },
  },
  actions: {
  },
  modules: {
  },
});
