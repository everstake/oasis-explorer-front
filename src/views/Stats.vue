<template>
  <div class="stats">
    <Breadcrumbs
      class="breadcrumbs"
      :crumbs="breadcrumbs"
    />

    <div class="stats__container">
      <b-row v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center account__loading">
            <font-awesome-icon
              class="icon account__icon"
              icon="spinner"
              spin
            />
          </div>
        </b-col>
      </b-row>
      <b-row
        v-else-if="!loading && (Array.isArray(items) && items.length === 0)"
      >
        <b-col cols="12">
          <div class="text-center block__empty">
            No data
          </div>
        </b-col>
      </b-row>
      <div
        v-else
        class="stats__charts"
      >
        <b-row>
          <b-col
            class="stats__information"
            cols="12"
            md="6"
          >
            <div class="stats__section">
              <b-card header="Escrow ratio">
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getEscrowRatioData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsLabelCallback"
                      :y-ticks-callback="yTickEscrowCallback"
                      :y-ticks-step-size="1"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col
            class="stats__information"
            cols="12"
            md="6"
          >
            <div class="stats__section">
              <b-card header="Transfer volume">
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getTransactionVolumeData"
                      :y-axes-max-ticks-limit="12"
                      :x-axes-max-ticks-limit="28"
                      y-axes-type="logarithmic"
                      :y-ticks-callback="$_yTicksCallback"
                      :tooltips-label-callback="$_tooltipsLabelCallback"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
        </b-row>
        <b-row class="stats__information">
          <b-col
            class="stats__information"
            cols="12"
            md="6"
          >
            <div class="stats__section stats__section--filter">
              <b-card header="# of operations">
                <b-button-group class="stats__actions">
                  <b-button
                    class="stats__switcher"
                    :class="{
                      'stats__switcher--active': operationDateFormat === 'D',
                    }"
                    @click="operationDateFormat = 'D'"
                  >
                    day
                  </b-button>
                  <b-button
                    class="stats__switcher"
                    :class="{
                      'stats__switcher--active': operationDateFormat === 'H',
                    }"
                    @click="operationDateFormat = 'H'"
                  >
                    hour
                  </b-button>
                </b-button-group>
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getOperationsData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsFeesLabelCallback"
                      :y-ticks-callback="formattedTicksCallback"
                      :y-ticks-step-size="100"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col
            class="stats__information"
            cols="12"
            md="6"
          >
            <div class="stats__section">
              <b-card header="# of accounts">
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getAccountsData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsFeesLabelCallback"
                      :y-ticks-callback="formattedTicksCallback"
                      class="stats-accounts"
                      :y-ticks-step-size="10"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
        </b-row>
        <b-row class="stats__information">
          <b-col
            class="stats__information"
            cols="12"
            md="6"
          >
            <div class="stats__section stats__section--filter">
              <b-card header="Fee volume">
                <b-button-group class="stats__actions">
                  <b-button
                    class="stats__switcher"
                    :class="{
                      'stats__switcher--active': feesDateFormat === 'D',
                    }"
                    @click="feesDateFormat = 'D'"
                  >
                    day
                  </b-button>
                  <b-button
                    class="stats__switcher"
                    :class="{
                      'stats__switcher--active': feesDateFormat === 'H',
                    }"
                    @click="feesDateFormat = 'H'"
                  >
                    hour
                  </b-button>
                </b-button-group>
                <b-card-text class="stats__content">
                  <div class="stats__container">
                    <LineChart
                      :chart-data="getFeesData"
                      :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                      :y-axes-begin-at-zero="false"
                      :tooltips-label-callback="tooltipsFeesLabelCallback"
                      :y-ticks-callback="yTicksFeesCallback"
                      :y-ticks-step-size="100000"
                    />
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col
            class="stats__information"
            cols="12"
            md="6"
          >
            <div class="stats__section">
              <b-card header="Top-10 voting power">
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
/*eslint-disable*/
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import LineChart from '@/components/charts/LineChart.vue';
import { state } from '@/store';
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
  mixins: [getDatesInSeconds],
  data() {
    return {
      operationDateFormat: 'D',
      feesDateFormat: 'D',
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
      xAxesMaxTicksLimit: 10,
      operationsData: null,
      accountsData: null,
      feesData: null,
      topEscrowData: null,
    };
  },
  watch: {
    operationDateFormat: {
      async handler(val) {
        const operations = await this.$api.getChartOperations({
          from: this.datesInSeconds.monthAgo,
          to: this.datesInSeconds.today,
          frame: val,
        });

        this.operationsData = operations.data;
      },
    },
    feesDateFormat: {
      async handler(val) {
        const fees = await this.$api.getChartFees({
          from: this.datesInSeconds.monthAgo,
          to: this.datesInSeconds.today,
          frame: val,
        });

        this.feesData = fees.data.map((item) => {
          if (item.fees === 0 || !item.fees) {
            return { ...item, fees: 0 };
          }

          return item;
        });
      },
    },
  },
  methods: {
    $_yTicksCallback(label) {
      return `${numeral(label / 1000000000).format('0,0')}`;
    },
    $_tooltipsLabelCallback(tooltipItem, data) {
      return `${data.datasets[0].label}: ${numeral(tooltipItem.value / 1000000000).format(
        '0,0',
      )}`;
    },
    async fetchData() {
      this.loading = true;

      const escrowRatio = await this.$api.getEscrowRatio({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      this.escrowRatioData = escrowRatio.data;

      const transactionVolume = await this.$api.getTransactionVolume({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      this.transactionVolumeData = transactionVolume.data;

      const operations = await this.$api.getChartOperations({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      this.operationsData = operations.data;

      const accounts = await this.$api.getChartAccounts({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      this.accountsData = accounts.data;

      const fees = await this.$api.getChartFees({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      this.feesData = fees.data.map((item) => {
        if (item.fees === 0 || !item.fees) {
          return { ...item, fees: 0 };
        }

        return item;
      });

      const topEscrow = await this.$api.getChartTopEscrow({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      this.topEscrowData = topEscrow.data;

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
          return `${xLabel}: ${yLabel}%`;
        }
      }
    },
    yTickEscrowCallback(label) {
      return `${label.toFixed()}%`;
    },
    // eslint-disable-next-line consistent-return
    yTickEscrowCallback(label) {
      return `${label.toFixed()}%`;
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
    tooltipsFeesLabelCallback(t, d) {
      const xLabel = d.datasets[t.datasetIndex].label;
      const { yLabel } = t;

      for (let i = 0; i <= 10; i += 1) {
        if (t.datasetIndex === i) {
          return `${xLabel}: ${numeral(yLabel).format('0,0')}`;
        }
      }
    },
    // eslint-disable-next-line consistent-return
    yTicksFeesCallback(label) {
      return numeral(label).format('0,0');
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
        return `Transfer volume: ${numeral(
          data.datasets[0].data[tooltipItem.index] / 1000000000,
        ).format('0,0.000000000')}`;
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
    formattedTicksCallback(label) {
      return numeral(label).format('0,0');
    },
  },
  computed: {
    getEscrowRatioData() {
      return {
        datasets: [
          {
            label: 'Escrow ratio',
            // eslint-disable-next-line camelcase
            data: this.escrowRatioData.map(({ escrow_ratio }) =>
              String(escrow_ratio).slice(0, 6),
            ),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.escrowRatioData.map(({ timestamp }) => {
          if (state.dateFormat === this.$constants.DATE_FORMAT) {
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
            data: this.operationsData.map(
              ({ operations_count }) => operations_count,
            ),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len,array-callback-return,consistent-return
        labels: this.operationsData.map(({ timestamp }) => {
          if (this.operationDateFormat === 'D') {
            if (state.dateFormat === this.$constants.DATE_FORMAT) {
              return dayjs.unix(timestamp).format('DD.MM.YYYY');
            }

            return dayjs.unix(timestamp).format('MM.DD.YYYY');
          }

          if (this.operationDateFormat === 'H') {
            if (state.dateFormat === this.$constants.DATE_FORMAT) {
              return dayjs.unix(timestamp).format('HH:mm DD.MM.YYYY');
            }

            return dayjs.unix(timestamp).format('hh:mm A MM.DD.YYYY');
          }
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
          if (state.dateFormat === this.$constants.DATE_FORMAT) {
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
            data: this.transactionVolumeData.map(
              ({ transaction_volume }) => {
                return transaction_volume;
              }
            ),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.transactionVolumeData.map(({ timestamp }) => {
          if (state.dateFormat === this.$constants.DATE_FORMAT) {
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
        // eslint-disable-next-line max-len,array-callback-return,consistent-return
        labels: this.feesData.map(({ timestamp }) => {
          if (this.feesDateFormat === 'D') {
            if (state.dateFormat === this.$constants.DATE_FORMAT) {
              return dayjs.unix(timestamp).format('DD.MM.YYYY');
            }

            return dayjs.unix(timestamp).format('MM.DD.YYYY');
          }

          if (this.feesDateFormat === 'H') {
            if (state.dateFormat === this.$constants.DATE_FORMAT) {
              return dayjs.unix(timestamp).format('HH:mm DD.MM.YYYY');
            }

            return dayjs.unix(timestamp).format('hh:mm A MM.DD.YYYY');
          }
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
            borderWidth: 1,
          },
        ],
        labels: this.topEscrowData.map(
          ({ account_name, account_id }) => account_name || account_id,
        ),
      };
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="scss">
.stats {
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
  &__section,
  &__section .card,
  &__section .card-body {
    height: 100%;
  }
  &__section--filter .card-body {
    padding-top: 10px;
  }
  &__switcher {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 10px;
    margin-bottom: 10px;
    font-size: 13px;
    color: $color-gray-333;
    background-color: #fff;
    border-color: #eee;

    &--active {
      background-color: #eee;
      border-color: #eee;
      color: $color-gray-333;
    }

    &:hover,
    &:focus,
    &:active {
      background-color: #eee !important;
      border-color: #eee !important;
      color: $color-gray-333 !important;
      box-shadow: none !important;
    }
  }

  &-accounts {
    margin-top: 30px;
  }
}
</style>
