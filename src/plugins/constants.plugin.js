import Vue from 'vue';

const networksTypes = {
  mainnet: 'mainnet',
  testnet: 'testnet',
};

const responseStatuses = [
  200,
  301,
];

const constants = {
  DATE_FORMAT: 'HH:mm DD.MM.YYYY',
  DATE_FORMAT_US: 'hh:mm A MM.DD.YYYY',
  SYSTEM_ACCOUNT_ID: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  MAINNET_URL: process.env.VUE_APP_MAINNET_URL,
  TESTNET_URL: process.env.VUE_APP_TESTNET_URL,
  NETWORK_TYPE: process.env.VUE_APP_NETWORK_TYPE,
  NETWORK_TYPES: networksTypes,
  RESPONSE_STATUSES: responseStatuses,
};

Vue.use({
  install() {
    Vue.prototype.$constants = constants;
  },
});
