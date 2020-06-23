export default {
  data() {
    return {
      todayInSeconds: null,
      thirtyDaysAgoInSeconds: null,
    };
  },
  created() {
    const todayInMs = new Date().getTime() / 1000;
    const thirtyDaysInMs = new Date(new Date().setDate(new Date().getDate() - 30)).getTime() / 1000;
    this.todayInSeconds = Math.round(todayInMs);
    this.thirtyDaysAgoInSeconds = Math.round(thirtyDaysInMs);
  },
};
