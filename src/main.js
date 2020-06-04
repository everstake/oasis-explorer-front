import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/initialization/bootstrap.plugin';
import './plugins/initialization/icons.plugin';
import './plugins/initialization/api.plugin';
import './filters/date.filter';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
