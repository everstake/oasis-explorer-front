import Vue from 'vue';
import VueGtag from 'vue-gtag';
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

Vue.use(
  VueGtag,
  {
    config: { id: 'UA-136304668-4' },
  },
  router,
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
