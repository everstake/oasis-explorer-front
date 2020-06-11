import http from './http.service';

const api = {
  getInfo: () => http.get('data/info'),
  getAccount: (params) => http.get(`data/accounts/${encodeURIComponent(params.id)}`),
  getAccounts: (params) => http.get('data/accounts', { params }),
  getBlocks: (params) => http.get('/data/blocks', { params }),
  getTransactions: (params) => http.get('/data/transactions', { params }),
  getEscrowRatio: (params) => http.get('/chart/escrow_ratio', { params }),
  getTransactionVolume: (params) => http.get('/chart/transactions_volume', { params }),
};

export default api;
