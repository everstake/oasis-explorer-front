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

export default {
  name: 'Stats',
  components: {
    LineChart,
    Breadcrumbs,
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
      xAxesMaxTicksLimit: 28,
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

      const transactionVolume = await this.$api.getTransactionVolume({
        from: this.thirtyDaysAgoInSeconds,
        to: this.todayInSeconds,
        frame: 'D',
      });

      this.escrowRatioData = escrowRatio.data;
      this.transactionVolumeData = transactionVolume.data;
      this.loading = false;
    },
    tooltipsLabelCallback(tooltipItem, data) {
      return `Transfer volume: ${data.datasets[0].data[tooltipItem.index]}`;
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
