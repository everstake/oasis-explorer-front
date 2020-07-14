export default {
  props: {
    rows: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      items: null,
      loading: false,
      error: false,
      limit: 50,
      offset: 0,
    };
  },
  methods: {
    async fetchList(endpoint, params = {}) {
      this.loading = true;
      const data = await this.$api[endpoint](params);
      const isResponseSuccessful = data.status === 200;

      if (isResponseSuccessful) {
        this.items = data.data;
      } else {
        this.error = true;
      }

      this.loading = false;
    },
  },
  computed: {
    getRequestLimit() {
      return this.rows || this.limit;
    },
  },
};
