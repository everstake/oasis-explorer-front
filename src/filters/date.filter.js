import Vue from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

Vue.filter('formatDate', (value) => dayjs.unix(value).format('DD/MM/YYYY'));
Vue.filter('formatDaysAgo', (value) => dayjs.unix(value).fromNow(true));
Vue.filter('formatUTCDate', (value) => dayjs(value).format('DD/MM/YYYY'));
Vue.filter('formatUTCDaysAgo', (value) => dayjs(value).fromNow());
