<template>
  <div class="home">
    <b-container v-if="loading">
      <font-awesome-icon v-if="loading" class="icon home__icon" icon="spinner" spin />
    </b-container>
    <div class="home__content" v-else>
      <b-container>
        <b-row class="mb-5">
          <b-col cols="3">
            <b-card
              @click="handleCardClick"
              class="card--link card--home"
              title="Current block height"
            >
              <b-card-text>
                <span class="home__link">
                  <font-awesome-icon v-if="!height" class="icon home__icon" icon="spinner" spin />
                  <span v-else>{{ height }}</span>
                </span>
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card title="Top-20 stake weight" class="card--home">
              <b-card-text>
                <font-awesome-icon
                  v-if="!topStakeWeight"
                  class="icon home__icon"
                  icon="spinner"
                  spin
                />
                <span v-else>{{ topStakeWeight.toFixed(3) }}%</span>
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card title="Escrow ratio">
              <b-card-text class="home__chart">
                <div v-if="!escrowRatio" class="home__loader">
                  <font-awesome-icon class="icon home__icon" icon="spinner" spin />
                </div>
                <line-chart
                  v-else
                  style="height: 200px"
                  :options="options"
                  :chart-data="getEscrowData()"
                />
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card title="Trading volume">
              <b-card-text class="home__chart">
                <div v-if="!transactionVolume" class="home__loader">
                  <font-awesome-icon class="icon home__icon" icon="spinner" spin />
                </div>
                <line-chart v-else :options="options" :chart-data="getTransactionVolumeData()" />
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
        <b-row
          class="home__section"
          v-if="price || marketCup || tradingVolume || circulatingSupply"
        >
          <b-col v-if="price" cols="3">
            <b-card title="Price" class="card--home">
              <b-card-text>
                {{ data.price }} chart
              </b-card-text>
            </b-card>
          </b-col>
          <b-col v-if="marketCup" cols="3">
            <b-card title="Market cup" class="card--home">
              <b-card-text>
                {{ data.marketCup }} chart
              </b-card-text>
            </b-card>
          </b-col>
          <b-col v-if="tradingVolume" cols="3">
            <b-card title="Trading volume" class="card--home">
              <b-card-text>
                {{ data.tradingVolume }}
              </b-card-text>
            </b-card>
          </b-col>
          <b-col v-if="circulatingSupply" cols="3">
            <b-card title="Circulating supply" class="card--home">
              <b-card-text>
                {{ circulatingSupply }}
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
        <b-row class="home__section">
          <b-col cols="6">
            <BlocksList :rows="10" :scrollToLoadMore="false" />
            <b-button
              to="/blocks"
              class="button button--outline"
              variant="outline-primary"
            >
              Show more
            </b-button>
          </b-col>
          <b-col cols="6">
            <TransactionsList :rows="10" :scrollToLoadMore="false" />
            <b-button
              to="/transactions"
              class="button button--outline"
              variant="outline-primary"
            >
              Show more
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import BlocksList from '@/components/BlocksList.vue';
import TransactionsList from '@/components/TransactionsList.vue';
import LineChart from '@/components/charts/LineChart.vue';
import dayjs from 'dayjs';

export default {
  name: 'Home',
  components: {
    BlocksList,
    TransactionsList,
    LineChart,
  },
  data() {
    return {
      loading: null,
      price: null,
      marketCup: null,
      tradingVolume: null,
      circulatingSupply: null,
      escrowRatio: null,
      transactionVolume: null,
      height: null,
      topStakeWeight: null,
      data: {
        price: 0,
        marketCup: 0,
        tradingVolume: 0,
        circulatingSupply: 0,
        escrowRatio: 0,
        currentBlockHeight: 0,
        topTwentyStakeWeight: 0,
      },
      options: {
        scales: {
          xAxes: [{
            display: false,
          }],
          yAxes: [{
            ticks: {
              display: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label(tooltipItem) {
              return String(tooltipItem.yLabel).slice(0, 5);
            },
          },
        },
      },
    };
  },
  methods: {
    getEscrowData() {
      /* eslint-disable */
      if (!this.escrowRatio) return;

      const data = {
          labels: [...this.escrowRatio.map(({ timestamp }) => dayjs.unix(timestamp).format('DD/MM/YYYY'))],
          datasets: [{
            backgroundColor: 'rgba(255, 122, 89, .8)',
            borderColor: 'rgb(255, 122, 89)',
            data: [...this.escrowRatio.map(({ escrow_ratio }) => escrow_ratio)],
          }],
        };
      return data;
    },
    getTransactionVolumeData() {
      /* eslint-disable */
      if (!this.transactionVolume) return;

      const data = {
          labels: [...this.transactionVolume.map(({ timestamp }) => dayjs.unix(timestamp).format('DD/MM/YYYY'))],
          datasets: [{
            backgroundColor: 'rgba(255, 122, 89, .8)',
            borderColor: 'rgb(255, 122, 89)',
            data: [...this.transactionVolume.map(({ transaction_volume }) => transaction_volume)],
          }],
        };
      return data;
    },
    handleCardClick() {
      this.$router.push({ name: 'block', params: { level: this.height } });
    },
  },
  async created() {
    const todayMs = new Date().getTime();
    const thirtyDaysMs = new Date(new Date().setDate(new Date().getDate() - 30)).getTime();

    const todaySec = Math.round(todayMs / 1000);
    const thirtyDaysSec = Math.round(thirtyDaysMs / 1000);

    const data = await this.$api.getInfo();

    const escrowRatio = await this.$api.getEscrowRatio({
      from: thirtyDaysSec,
      to: todaySec,
      frame: 'D',
    });

    const transactionVolume = await this.$api.getTransactionVolume({
      from: thirtyDaysSec,
      to: todaySec,
      frame: 'D',
    });

    this.escrowRatio = escrowRatio.data;
    this.transactionVolume = transactionVolume.data;

    this.height = data.data.height;
    this.topStakeWeight = data.data.top_escrow;
  },
};
</script>

<style lang="scss">
  .home {
    margin: 50px 0;
    text-align: center;
    
    &__section {
      overflow: hidden;
    }

    &__section:not(:last-child) {
      padding-bottom: 50px;
    }

    &__link {
      color: $color-primary;
    }

    &__chart {
      display: block;
    }

    &__loader {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    &__icon {
      font-size: 20px;
      color: $color-primary;
    }
  }
</style>
