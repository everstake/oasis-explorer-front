import Vue from 'vue';
import { sliceStringFromTo } from '@/helpers/slice.string.helper';

const trimHash = (hash) => sliceStringFromTo(hash, 6, -4);

Vue.filter('trimHash', trimHash);

export default trimHash;
