import Vue from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import store from '@/store';

dayjs.extend(relativeTime);

Vue.filter('formatDate', (value) => dayjs.unix(value).format(store.state.dateFormat));
Vue.filter('formatDaysAgo', (value) => dayjs.unix(value).fromNow());
Vue.filter('formatUTCDate', (value) => dayjs(value).format(store.state.dateFormat));
Vue.filter('formatUTCDaysAgo', (value) => dayjs(value).fromNow());
