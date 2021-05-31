import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import '@/plugins/constants.plugin';
import '@/filters/date.filter';
import '@/filters/amount.filter';

import '@/plugins/initialization/notifications.plugin';

import { config } from '@vue/test-utils';

Vue.use(BootstrapVue);

library.add(fas, fab);

Vue.component('font-awesome-icon', FontAwesomeIcon);

config.mocks.$api = {
  getAccounts: () => Promise.resolve({ data: ['mock'], status: 200 }),
  getAccount: () => Promise.resolve({ data: { address: 'mock' }, status: 200 }),
  getValidators: () => Promise.resolve({ data: ['mock'], status: 200 }),
  getTransactions: () => Promise.resolve({ data: ['mock'], status: 200 }),
  getBlocks: () => Promise.resolve({ data: ['mock'], status: 200 }),
  getValidatorsList: () => Promise.resolve({ data: ['mock'], status: 200 }),
};
