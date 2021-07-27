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
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  faTwitter,
  faFacebookSquare,
  faMediumM,
  faTelegram,
  faFacebook,
  faMedium,
} from '@fortawesome/free-brands-svg-icons';

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
  faTwitter,
  faFacebookSquare,
  faMediumM,
  faTelegram,
  faFacebook,
  faMedium,
  faExclamationCircle,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
