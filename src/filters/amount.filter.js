import Vue from 'vue';
import numeral from 'numeral';

const formatAmount = (amount) => {
  if (amount <= 1) {
    return amount;
  }
  return numeral(amount / 1000000000).format('0,0.[000000000]');
};

Vue.filter('formatAmount', formatAmount);

export default formatAmount;
