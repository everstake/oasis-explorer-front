import Vue from 'vue';

const formatPercent = (value) => {
  if (!value) {
    return 0;
  }

  return Number(value) / 1000;
};

Vue.filter('formatPercent', formatPercent);

export default formatPercent;
