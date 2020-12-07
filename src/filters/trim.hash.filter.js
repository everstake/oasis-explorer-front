import Vue from 'vue';
import { sliceStringFromTo } from '@/helpers/slice.string.helper';

const trimHash = (hash) => sliceStringFromTo(hash, 6, -4);
const trimHashFromTo = (hash, from, to) => sliceStringFromTo(hash, from, to);

Vue.filter('trimHash', trimHash);
Vue.filter('trimHashFromTo', trimHashFromTo);

export {
  trimHash,
  trimHashFromTo,
};
