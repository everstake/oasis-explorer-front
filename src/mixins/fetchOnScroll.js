import debounce from 'lodash/debounce';

export default {
  props: {
    fetchOnScrollEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isShowMoreButtonDisabled: false,
      timeout: null,
    };
  },
  watch: {
    isShowMoreButtonDisabled: {
      immediate: false,
      handler(val) {
        if (val && this.timeout !== null) {
          this.removeEventListenerOnScroll();
        } else if (this.timeout === null) {
          this.setEventListenerOnScroll();
        }
      },
    },
  },
  methods: {
    onUserScroll() {
      if (!this.$refs.table) return;
      const { innerHeight } = window;
      const tableHeight = this.$refs.table.$el.getBoundingClientRect().bottom;
      if (this.$refs.table) {
        if (innerHeight > tableHeight) {
          this.handleShowMore();
        }
      }
    },
    async handleShowMore() {
      if (this.loading) return;

      this.loading = true;
      this.offset += 50;
      const data = await this.fetchData({ offset: this.offset });
      const isRequestSuccessful = data.status === 200;
      const isDataEmpty = Array.isArray(data.data) && data.data.length === 0;
      const dataLengthLessThanLimit = Array.isArray(data.data) && data.data.length < 10;
      if (isDataEmpty) {
        this.isShowMoreButtonDisabled = true;
        this.loading = false;
        return;
      }
      if (dataLengthLessThanLimit) {
        this.isShowMoreButtonDisabled = true;
        this.loading = false;
        return;
      }
      if (isRequestSuccessful) {
        this.items = [...this.items, ...data.data];
        this.error = false;
        this.isShowMoreButtonDisabled = false;
      } else {
        this.error = true;
      }

      this.loading = false;
    },
    setEventListenerOnScroll() {
      this.timeout = debounce(this.onUserScroll, 100);
      window.addEventListener('scroll', this.timeout);
    },
    removeEventListenerOnScroll() {
      if (this.timeout !== null) {
        this.timeout.cancel();
      }
      window.removeEventListener('scroll', this.timeout);
      this.timeout = null;
    },
  },
  created() {
    const {
      isShowMoreButtonDisabled,
      fetchOnScrollEnabled,
      setEventListenerOnScroll,
    } = this;

    if (isShowMoreButtonDisabled) {
      return;
    }

    if (fetchOnScrollEnabled) {
      setEventListenerOnScroll();
    }
  },
  beforeDestroy() {
    if (this.fetchOnScrollEnabled) {
      this.removeEventListenerOnScroll();
    }
  },
};
