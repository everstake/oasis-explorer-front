import Vue from 'vue';
import numeral from 'numeral';

Vue.filter('formatAmount', (amount) => numeral(amount / 1000000000).format('0,0.[000000000]'));
