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
      if (this.$refs.table) {
        const { innerHeight } = window;
        const tableHeight = this.$refs.table.$el.getBoundingClientRect().bottom;
        if (this.$refs.table) {
          if (innerHeight > tableHeight) {
            this.handleShowMore();
          }
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
      if (isDataEmpty) {
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
    handleScrollToShowMore() {
      const { showMoreButton } = this.$refs;

      if (!showMoreButton) {
        return;
      }

      const root = null;
      const target = showMoreButton;
      const rootMargin = '0px 0px -100px 0px';
      const threshold = 1.0;

      const options = { root, rootMargin, threshold };

      const callback = (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            const handleScroll = debounce(this.handleShowMore, 200);
            handleScroll();
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);

      observer.observe(target);
    },
  },
  updated() {
    const { isShowMoreButtonDisabled, setEventListenerOnScroll } = this;

    if (isShowMoreButtonDisabled) {
      return;
    }

    setEventListenerOnScroll();
  },
  beforeDestroy() {
    if (this.fetchOnScrollEnabled) {
      this.removeEventListenerOnScroll();
    }
  },
};
