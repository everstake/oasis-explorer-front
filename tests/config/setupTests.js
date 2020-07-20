import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import '@/plugins/constants.plugin';
import '@/filters/date.filter';
import '@/filters/amount.filter';

import '@/plugins/initialization/notifications.plugin';

Vue.use(BootstrapVue);

library.add(fas, fab, far);

Vue.component('font-awesome-icon', FontAwesomeIcon);
