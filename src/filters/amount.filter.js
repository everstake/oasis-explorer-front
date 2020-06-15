import Vue from 'vue';
import numeral from 'numeral';

Vue.filter('formatAmount', (amount) => numeral(amount).format('0,0'));
