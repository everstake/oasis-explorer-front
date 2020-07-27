import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const defaultDateFormat = localStorage.getItem('dateFormat') || Vue.prototype.$constants.DATE_FORMAT;

const state = {
  height: null,
  dateFormat: defaultDateFormat,
};

const mutations = {
  setInfo(state, payload) {
    state.height = payload.height;
  },
  setDateFormat(state, payload) {
    localStorage.setItem('dateFormat', payload);
    state.dateFormat = payload;
  },
};

const actions = {};
const modules = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
});

export {
  state,
  mutations,
  actions,
  modules,
}