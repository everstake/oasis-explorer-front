import Vue from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { state } from '@/store';

dayjs.extend(relativeTime);

const formatDate = (value) => dayjs.unix(value).format(state.dateFormat);
const formatYear = (value) => dayjs.unix(value).format('DD.MM.YYYY');
const formatDaysAgo = (value) => dayjs.unix(value).fromNow();
const formatUTCDate = (value) => dayjs(value).format(state.dateFormat);
const formatUTCDaysAgo = (value) => dayjs(value).fromNow();

Vue.filter('formatDate', formatDate);
Vue.filter('formatYear', formatYear);
Vue.filter('formatDaysAgo', formatDaysAgo);
Vue.filter('formatUTCDate', formatUTCDate);
Vue.filter('formatUTCDaysAgo', formatUTCDaysAgo);

export {
  formatDate,
  formatYear,
  formatDaysAgo,
  formatUTCDate,
  formatUTCDaysAgo,
};
