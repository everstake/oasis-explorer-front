export default {
  data() {
    return {
      datesInSeconds: {
        today: null,
        monthAgo: null,
      },
    };
  },
  methods: {
    getPreviousDate(offset) {
      const findedDateMs = new Date(new Date().setDate(new Date().getDate() - offset)).getTime();
      return Math.round(findedDateMs / 1000);
    },
    getToday() {
      return Math.round(new Date().getTime() / 1000);
    },
    getFutureDate(offset) {
      const findedDateMs = new Date(new Date().setDate(new Date().getDate() + offset)).getTime();
      return Math.round(findedDateMs / 1000);
    },
  },
  created() {
    this.datesInSeconds.today = this.getToday();
    this.datesInSeconds.monthAgo = this.getPreviousDate(30);
  },
};
