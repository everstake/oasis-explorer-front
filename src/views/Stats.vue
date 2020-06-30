<template>
  <div class="stats">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <div class="stats__container">
      <b-row v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center account__loading">
            <font-awesome-icon class="icon account__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="!loading && (Array.isArray(items) && items.length === 0)">
        <b-col cols="12">
          <div class="text-center block__empty">
            No data
          </div>
        </b-col>
      </b-row>
      <div class="stats__charts" v-else>
        <b-row class="stats__information">
          <b-col cols="6">
            <div class="stats__section">
              <b-card
                header="Escrow ratio"
              >
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      @on-receive="handleChartClick"
                      :chart-data="getEscrowRatioData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltipsLabelCallback="tooltipsLabelCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="stats__section">
              <b-card
                header="Transfer volume"
              >
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getTransactionVolumeData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsLabelCallbackFormatAmount"
                      :yTicksCallback="transactionVolumeTicksCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
        </b-row>
        <b-row class="stats__information">
          <b-col cols="6">
            <div class="stats__section">
              <b-card
                header="# of operations"
              >
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getOperationsData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsDefaultLabelCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="stats__section">
              <b-card
                header="# of accounts"
              >
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getAccountsData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsDefaultLabelCallback"
                      :yTicksCallback="defaultTicksCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
        </b-row>
        <b-row class="stats__information">
          <b-col cols="6">
            <div class="stats__section">
              <b-card
                header="Fee volume"
              >
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getFeesData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsDefaultLabelCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="stats__section">
              <b-card
                header="Top-10 voting power"
              >
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <PieChart
                      :chart-data="getTopEscrowData"
                      :tooltips-label-callback="pieTooltipsLabelCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import LineChart from '@/components/charts/LineChart.vue';
import store from '@/store';
import dayjs from 'dayjs';
import numeral from 'numeral';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';
import PieChart from '@/components/charts/PieChart.vue';

export default {
  name: 'Stats',
  components: {
    LineChart,
    Breadcrumbs,
    PieChart,
  },
  mixins: [
    getDatesInSeconds,
  ],
  data() {
    return {
      loading: null,
      items: null,
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          text: 'Stats',
          active: true,
        },
      ],
      escrowRatioData: null,
      transactionVolumeData: null,
      palette: [
        '#4CD4A9',
        '#1BB8A8',
        '#009B9F',
        '#187E8D',
        '#2A6275',
        '#2F4858',
      ],
      xAxesMaxTicksLimit: 5,
      operationsData: null,
      accountsData: null,
      feesData: null,
      topEscrowData: null,
    };
  },
  methods: {
    handleChartClick(item) {
      console.log('Stats click handling', item);
    },
    async fetchData() {
      this.loading = true;

      const escrowRatio = await this.$api.getEscrowRatio({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.escrowRatioData = escrowRatio.data;

      const transactionVolume = await this.$api.getTransactionVolume({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.transactionVolumeData = transactionVolume.data;

      const operations = await this.$api.getChartOperations({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.operationsData = operations.data;

      const accounts = await this.$api.getChartAccounts({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.accountsData = accounts.data;

      const fees = await this.$api.getChartFees({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.feesData = fees.data.map((fee) => {
        if (fee === 0 || !fee) {
          return 0;
        }

        return fee;
      });

      const topEscrow = await this.$api.getChartTopEscrow({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.topEscrowData = topEscrow.data;
      console.log(this.topEscrowData);

      this.loading = false;
    },
    pieTooltipsLabelCallback(tooltipItem, data) {
      return `${data.labels[tooltipItem.index]}: ${
        data.datasets[0].data[tooltipItem.index]
      }%`;
    },
    // eslint-disable-next-line consistent-return
    tooltipsLabelCallback(t, d) {
      const xLabel = d.datasets[t.datasetIndex].label;
      const { yLabel } = t;

      for (let i = 0; i <= 10; i += 1) {
        if (t.datasetIndex === i) {
          return `${xLabel}: ${yLabel * 100}%`;
        }
      }
    },
    // eslint-disable-next-line consistent-return
    tooltipsDefaultLabelCallback(t, d) {
      const xLabel = d.datasets[t.datasetIndex].label;
      const { yLabel } = t;

      for (let i = 0; i <= 10; i += 1) {
        if (t.datasetIndex === i) {
          return `${xLabel}: ${yLabel}`;
        }
      }
    },
    // eslint-disable-next-line consistent-return
    tooltipsDefaultToFixedLabelCallback(t, d) {
      const xLabel = d.datasets[t.datasetIndex].label;
      const { yLabel } = t;

      for (let i = 0; i <= 10; i += 1) {
        if (t.datasetIndex === i) {
          return `${xLabel}: ${yLabel}`;
        }
      }
    },
    tooltipsLabelCallbackFormatAmount(tooltipItem, data) {
      if (data.datasets[0].data[tooltipItem.index] > 0) {
        return `Transfer volume: ${numeral(data.datasets[0].data[tooltipItem.index] / 1000000000).format('0,0.000000000')}`;
      }

      return data.datasets[0].data[tooltipItem.index];
    },
    transactionVolumeTicksCallback(label) {
      if (label > 1) {
        return numeral(label / 1000000000).format('0,0.[000000000]');
      }

      return label.toFixed();
    },
    defaultTicksCallback(label) {
      return label.toFixed();
    },
  },
  computed: {
    getEscrowRatioData() {
      return {
        datasets: [
          {
            label: 'Escrow ratio',
            // eslint-disable-next-line camelcase
            data: this.escrowRatioData.map(({ escrow_ratio }) => escrow_ratio),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.escrowRatioData.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getOperationsData() {
      return {
        datasets: [
          {
            label: '# of operations',
            // eslint-disable-next-line camelcase
            data: this.operationsData.map(({ operations_count }) => operations_count),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.operationsData.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getAccountsData() {
      return {
        datasets: [
          {
            label: '# of accounts',
            // eslint-disable-next-line camelcase
            data: this.accountsData.map(({ accounts_count }) => accounts_count),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.accountsData.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getTransactionVolumeData() {
      return {
        datasets: [
          {
            label: 'Transfer volume',
            // eslint-disable-next-line camelcase
            data: this.transactionVolumeData.map(({ transaction_volume }) => transaction_volume),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.transactionVolumeData.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getFeesData() {
      return {
        datasets: [
          {
            label: 'Fee volume',
            // eslint-disable-next-line camelcase
            data: this.feesData.map(({ fees }) => fees),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.feesData.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getTopEscrowData() {
      /* eslint-disable */
      return {
        datasets: [
          {
            data: this.topEscrowData.map(({ esrow_ratio }) => esrow_ratio),
            backgroundColor: this.palette,
            borderWidth: 1
          }
        ],
        labels: this.topEscrowData.map(({ account_name, account_id }) => account_name || account_id),
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="scss">
  .stats {
    &__content {}
    &__container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: space-between;
      height: 100%;
      margin: 0 15px;
    }
    &__item {
      color: $color-gray-999;

      &:last-child {
        margin-bottom: 0;
      }
    }
    &__title {
      margin-bottom: 35px;
      font-size: 24px;
      color: $color-gray-333;
    }
    &__validator {
      margin-top: 50px;
    }
    &__value {
      color: #333;
    }
    &__information {
      margin-bottom: 50px;
    }
  }
</style>
