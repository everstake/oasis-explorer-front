import http from './http.service';

export default {
  getInfo: () => http.get('data/info'),
  getAccounts: (params) => http.get('data/accounts', { params }),
  getAccount: (params) => http.get(`data/accounts/${encodeURIComponent(params.id)}`),
  getValidators: (params) => http.get('data/validators', { params }),
  getValidator: (params) => http.get(`data/validator/${encodeURIComponent(params.id)}`, { params }),
  getValidatorDelegators: (params) => http.get(`data/validator/${encodeURIComponent(params.id)}/delegators`, { params }),
  getValidatorUptime: (params) => http.get(`chart/validator_stat/${encodeURIComponent(params.id)}`, { params }),
  getValidatorStake: (params) => http.get(`chart/balance/${encodeURIComponent(params.id)}`, { params }),
  getBlocks: (params) => http.get('/data/blocks', { params }),
  getTransactions: (params) => http.get('/data/transactions', { params }),
  getEscrowRatio: (params) => http.get('/chart/escrow_ratio', { params }),
  getTransactionVolume: (params) => http.get('/chart/transactions_volume', { params }),
};
