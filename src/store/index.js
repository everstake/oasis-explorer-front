import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const defaultDateFormat = localStorage.getItem('dateFormat') || Vue.prototype.$constants.DATE_FORMAT;

export default new Vuex.Store({
  state: {
    height: null,
    dateFormat: defaultDateFormat,
  },
  mutations: {
    setInfo(state, payload) {
      state.height = payload.height;
    },
    setDateFormat(state, payload) {
      localStorage.setItem('dateFormat', payload);
      state.dateFormat = payload;
    },
  },
  actions: {
  },
  modules: {
  },
});
