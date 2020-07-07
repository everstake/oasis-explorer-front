export default {
  computed: {
    isDeviceMobile() {
      return window.innerWidth >= 320 && window.innerWidth <= 768;
    },
    isDeviceTablet() {
      return window.innerWidth >= 768;
    },
    isDeviceLaptop() {
      return window.innerWidth >= 1024;
    },
  },
};
