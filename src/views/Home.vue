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
                  <span v-else>{{ parseFloat(topStakeWeight.toFixed(3)) }}%</span>
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
                    :height="60"
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
                title="Transfer volume"
              >
                <b-card-text class="home__chart">
                  <div v-if="!transactionVolume" class="home__loader">
                    <font-awesome-icon class="icon home__icon" icon="spinner" spin />
                  </div>
                  <line-chart
                    v-else
                    :height="60"
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
              title="Trading volume"
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
                { key: 'hash', label: 'Hash' },
                { key: 'number_of_txs', label: '# of Ops' },
                { key: 'timestamp', label: 'Date' },
              ]"
              class="table-list"
              :minify-table-hash="true"
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
            <p class="home__title">Operations list</p>
            <OperationsList
              :rows="10"
              :scrollToLoadMore="false"
              :fields="[
                { key: 'level', label: 'Height' },
                { key: 'hash', label: 'Hash' },
                { key: 'type', label: 'Type' },
                { key: 'timestamp', label: 'Date' },
              ]"
              :minifyTableHash="true"
              :filters="false"
              class="table-list"
            />
            <b-button
              to="/operations"
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
import OperationsList from '@/components/OperationsList.vue';
import LineChart from '@/components/charts/LineChart.vue';
import dayjs from 'dayjs';
import { mapMutations } from 'vuex';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';

export default {
  name: 'Home',
  components: {
    BlocksList,
    OperationsList,
    LineChart,
  },
  mixins: [
    getDatesInSeconds,
  ],
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
    ...mapMutations(['setInfo']),
    getEscrowData() {
      /* eslint-disable */
      if (!this.escrowRatio) return;

      return {
        labels: [...this.escrowRatio.map(({timestamp}) => dayjs.unix(timestamp).format('DD/MM/YYYY'))],
        datasets: [{
          backgroundColor: '#4cd4a9',
          borderColor: '#4cd4a9',
          data: [...this.escrowRatio.map(({escrow_ratio}) => escrow_ratio)],
        }],
      };
    },
    getTransactionVolumeData() {
      /* eslint-disable */
      if (!this.transactionVolume) return;

      return {
        labels: [...this.transactionVolume.map(({timestamp}) => dayjs.unix(timestamp).format('DD/MM/YYYY'))],
        datasets: [{
          backgroundColor: '#4cd4a9',
          borderColor: '#4cd4a9',
          data: [...this.transactionVolume.map(({transaction_volume}) => transaction_volume)],
        }],
      };
    },
    handleCardClick() {
      this.$router.push({ name: 'block', params: { id: this.height } });
    },
    handleChartClick() {
      this.$router.push({ name: 'stats' });
    },
  },
  async created() {
    const data = await this.$api.getInfo();

    this.height = data.data.height;
    this.topStakeWeight = data.data.top_escrow;

    this.setInfo(data.data);

    const escrowRatio = await this.$api.getEscrowRatio({
      from: this.thirtyDaysAgoInSeconds,
      to: this.todayInSeconds,
      frame: 'D',
    });

    this.escrowRatio = escrowRatio.data;

    const transactionVolume = await this.$api.getTransactionVolume({
      from: this.thirtyDaysAgoInSeconds,
      to: this.todayInSeconds,
      frame: 'D',
    });

    this.transactionVolume = transactionVolume.data;
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
      height: 60px;
    }

    &__icon {
      font-size: 20px;
      color: $color-primary;
    }

    &-card {
      &__chart {
        height: 100%;
        cursor: pointer;
      }
    }
  }
</style>
