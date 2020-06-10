import http from './http.service';

const api = {
  getInfo: () => http.get('data/info'),
  getAccounts: (params) => http.get(`data/accounts/${encodeURIComponent(params.id)}`),
  getBlocks: (params) => http.get('/data/blocks', { params }),
  getTransactions: (params) => http.get('/data/transactions', { params }),
  getEscrowRatio: (params) => http.get('/chart/escrow_ratio', { params }),
  getTransactionVolume: (params) => http.get('/chart/transactions_volume', { params }),
};

export default api;
