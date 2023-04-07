import Vue from 'vue';

const networksTypes = {
  mainnet: 'mainnet',
  testnet: 'testnet',
};

const env = {
  API_URL: '',
  MAINNET_URL: '',
  TESTNET_URL: '',
  NETWORK_TYPE: '',
};
console.log(window.location.href);
if (window.location.origin === 'https://oasismonitor.com') {
  env.API_URL = 'https://api.oasismonitor.com';
  env.NETWORK_TYPE = 'mainnet';
  env.MAINNET_URL = 'https://oasismonitor.com';
  env.TESTNET_URL = 'https://testnet.oasismonitor.com';
} else if (window.location.origin === 'https://stage.oasismonitor.com') {
  env.API_URL = 'https://api-stage.oasismonitor.com';
  env.NETWORK_TYPE = 'mainnet';
  env.MAINNET_URL = 'https://stage.oasismonitor.com';
  env.TESTNET_URL = 'https://testnet-stage.oasismonitor.com';
} else if (window.location.origin === 'https://testnet.oasismonitor.com') {
  env.API_URL = 'https://testnet-api.oasismonitor.com';
  env.NETWORK_TYPE = 'testnet';
  env.MAINNET_URL = 'https://oasismonitor.com';
  env.TESTNET_URL = 'https://testnet.oasismonitor.com';
} else if (window.location.origin === 'https://testnet-stage.oasismonitor.com') {
  env.API_URL = 'https://testnet-api-stage.oasismonitor.com';
  env.NETWORK_TYPE = 'testnet';
  env.MAINNET_URL = 'https://stage.oasismonitor.com';
  env.TESTNET_URL = 'https://testnet-stage.oasismonitor.com';
} else {
  env.API_URL = 'https://api.oasismonitor.com';
  env.NETWORK_TYPE = 'mainnet';
  env.MAINNET_URL = 'https://oasismonitor.com';
  env.TESTNET_URL = 'https://testnet.oasismonitor.com';
}

const constants = {
  DATE_FORMAT: 'HH:mm DD.MM.YYYY',
  DATE_FORMAT_US: 'hh:mm A MM.DD.YYYY',
  SYSTEM_ACCOUNT_ID: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  API_URL: env.API_URL,
  MAINNET_URL: env.MAINNET_URL,
  TESTNET_URL: env.TESTNET_URL,
  NETWORK_TYPE: env.NETWORK_TYPE,
  NETWORK_TYPES: networksTypes,
};

Vue.use({
  install() {
    Vue.prototype.$constants = constants;
  },
});

export default constants;
