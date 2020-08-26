import Vue from 'vue';
import numeral from 'numeral';

const formatAmount = (amount) => numeral(amount / 1000000000).format('0,0.[000000000]');

Vue.filter('formatAmount', formatAmount);

export default formatAmount;
