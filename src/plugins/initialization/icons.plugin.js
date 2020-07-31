import Vue from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSearch,
  faNetworkWired,
  faFlag,
  faCog,
  faSpinner,
  faArrowCircleDown,
  faChevronLeft,
  faChevronRight,
  faCopy,
  faSync,
  faCalendarCheck,
  faCheckCircle,
  faTimesCircle,
  faGlobe,
  faEnvelope,
  faSyncAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faSearch,
  faNetworkWired,
  faFlag,
  faCog,
  faSpinner,
  faArrowCircleDown,
  faChevronLeft,
  faChevronRight,
  faCopy,
  faSync,
  faCalendarCheck,
  faCheckCircle,
  faTimesCircle,
  faGlobe,
  faEnvelope,
  faSyncAlt,
  faTimes,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
