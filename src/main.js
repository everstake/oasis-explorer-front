import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/initialization/bootstrap.plugin';
import './plugins/initialization/icons.plugin';
import './plugins/initialization/api.plugin';
import './plugins/initialization/notifications.plugin';
import './plugins/constants.plugin';
import './filters/date.filter';
import './filters/amount.filter';
import './filters/trim.hash.filter';
import './filters/percent.filter';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
