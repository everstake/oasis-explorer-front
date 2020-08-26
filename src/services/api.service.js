import http from './http.service';
/*eslint-disable*/
export default {
  getInfo: () => http.get('data/info'),
  getAccounts: (params) => http.get('data/accounts', { params }),
  getAccount: (params) =>
    http.get(`data/accounts/${encodeURIComponent(params.id)}`),
  getValidators: (params) => http.get('data/validators', { params }),
  getValidatorsList: (params) =>
    http.get('/data/validators/search', { params }),
  getValidator: (params) =>
    http.get(`data/validator/${encodeURIComponent(params.id)}`, { params }),
  getValidatorDelegators: (params) =>
    http.get(`data/validator/${encodeURIComponent(params.id)}/delegators`, {
      params,
    }),
  getChartUptime: (params) =>
    http.get(`chart/validator_stat/${encodeURIComponent(params.id)}`, {
      params,
    }),
  getChartStake: (params) =>
    http.get(`chart/balance/${encodeURIComponent(params.id)}`, { params }),
  getChartOperations: (params) =>
    http.get('chart/operations/count', { params }),
  getChartAccounts: (params) => http.get('chart/accounts/count', { params }),
  getChartFees: (params) => http.get('chart/fees/volume', { params }),
  getChartTopEscrow: (params) => http.get('chart/top_escrow_ratio', { params }),
  getBlocks: (params) => http.get('/data/blocks', { params }),
  getTransactions: (params) => http.get('/data/transactions', { params }),
  getEscrowRatio: (params) => http.get('/chart/escrow_ratio', { params }),
  getTransactionVolume: (params) =>
    http.get('/chart/transactions_volume', { params }),
  getValidatorRewards: (params) =>
    http.get(`/data/validator/${params.id}/rewards`, { params }),
  getValidatorRewardsStat: (params) =>
    http.get(`/data/validator/${params.id}/rewards/stat`, { params }),
};
