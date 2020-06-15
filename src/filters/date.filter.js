import Vue from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

Vue.filter('formatDate', (value) => dayjs.unix(value).format(' HH:mm DD/MM/YYYY'));
Vue.filter('formatDaysAgo', (value) => dayjs.unix(value).fromNow());
Vue.filter('formatUTCDate', (value) => dayjs(value).format(' HH:mm DD/MM/YYYY'));
Vue.filter('formatUTCDaysAgo', (value) => dayjs(value).fromNow());
