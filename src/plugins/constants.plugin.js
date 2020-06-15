import Vue from 'vue';

const constants = {
  DATE_FORMAT: 'HH:mm DD.MM.YYYY',
  DATE_FORMAT_US: 'hh:mm A MM.DD.YYYY',
};

Vue.use({
  install() {
    Vue.prototype.$constants = constants;
  },
});
