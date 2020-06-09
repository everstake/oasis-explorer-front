<template>
  <div class="home">
    <b-container v-if="loading">
      <font-awesome-icon v-if="loading" class="icon home__icon" icon="spinner" spin />
    </b-container>
    <div class="home__content" v-else>
      <b-container>
        <div class="home__cards">
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
              <b-card
                @click="handleChartClick()"
                class="home-card__chart"
                title="Escrow ratio"
              >
                <b-card-text>
                  <div v-if="!escrowRatio" class="home__loader">
                    <font-awesome-icon class="icon home__icon" icon="spinner" spin />
                  </div>
                  <line-chart
                    v-else
                    :height="100"
                    :options="options"
                    :chart-data="getEscrowData()"
                    class="home__chart"
                  />
                </b-card-text>
              </b-card>
            </b-col>
            <b-col cols="3">
              <b-card
                @click="handleChartClick()"
                class="home-card__chart"
                title="Trading volume"
              >
                <b-card-text class="home__chart">
                  <div v-if="!transactionVolume" class="home__loader">
                    <font-awesome-icon class="icon home__icon" icon="spinner" spin />
                  </div>
                  <line-chart
                    v-else
                    :height="100"
                    :options="options"
                    :chart-data="getTransactionVolumeData()"
                    class="home__chart"
                  />
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
          <b-col cols="3">
            <b-card
              class="card--home"
              title="Price"
            >
              <b-card-text>
                No data
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card title="Market cap" class="card--home">
              <b-card-text>
                No data
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card
              class="card--home"
              title="Transaction volume"
            >
              <b-card-text>
                No data
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="3">
            <b-card
              class="card--home"
              title="Circulating supply"
            >
              <b-card-text>
                No data
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
        </div>
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
            <b-card title="Market cap" class="card--home">
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
            <p class="home__title">Blocks list</p>
            <BlocksList
              :rows="10"
              :scrollToLoadMore="false"
              :fields="[
                { key: 'level', label: 'Height' },
                { key: 'hash', label: 'Block hash' },
                { key: 'number_of_txs', label: 'Number of Ops' },
                { key: 'timestamp', label: 'Date' },
              ]"
            />
            <b-button
              to="/blocks"
              class="button button--outline"
              variant="outline-primary"
            >
              Show more
            </b-button>
          </b-col>
          <b-col cols="6">
            <p class="home__title">Transactions list</p>
            <TransactionsList
              :rows="10"
              :scrollToLoadMore="false"
              :fields="[
                { key: 'level', label: 'Height' },
                { key: 'hash', label: 'Block Hash' },
                { key: 'type', label: 'Type' },
                { key: 'timestamp', label: 'Date' },
              ]"
            />
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
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
            },
          }],
          yAxes: [{
            ticks: {
              display: false,
            },
            gridLines: {
              display: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
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
            backgroundColor: '#4cd4a9',
            borderColor: '#4cd4a9',
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
            backgroundColor: '#4cd4a9',
            borderColor: '#4cd4a9',
            data: [...this.transactionVolume.map(({ transaction_volume }) => transaction_volume)],
          }],
        };
      return data;
    },
    handleCardClick() {
      this.$router.push({ name: 'block', params: { id: this.height } });
    },
    handleChartClick() {
      return false;
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
    margin: 100px 0;
    text-align: center;

    &__cards {
      margin-bottom: 100px;
    }
    
    &__section {
      overflow: hidden;
    }

    &__section:not(:last-child) {
      padding-bottom: 50px;
    }

    &__title {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 25px;
      font-size: 24px;
      color: #333;
      font-weight: bold;
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
      height: 53px;
    }

    &__icon {
      font-size: 20px;
      color: $color-primary;
    }

    &-card {
      &__chart {
        height: 100%;
      }
    }
  }
</style>
