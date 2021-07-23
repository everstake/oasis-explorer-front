<template>
  <div class="home">
    <div class="home__content">
      <b-container fluid="lg">
        <div class="home__cards">
          <b-row class="mb-5">
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                class="card--link card--home"
                title="Current block height"
                @click="handleCardClick"
              >
                <b-card-text>
                  <span class="home__link">
                    <font-awesome-icon
                      v-if="!latestHeight.height"
                      class="icon home__icon"
                      icon="spinner"
                      spin
                    />
                    <span v-else>{{ latestHeight.height }}</span>
                  </span>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                title="Top-20 stake weight"
                class="card--home"
              >
                <b-card-text>
                  <font-awesome-icon
                    v-if="!topStakeWeight"
                    class="icon home__icon"
                    icon="spinner"
                    spin
                  />
                  <span
                    v-else
                  >{{ parseFloat(topStakeWeight.toFixed(3)) }}%</span>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                class="home-card__chart"
                title="Escrow ratio"
                @click="handleChartClick()"
              >
                <b-card-text>
                  <div
                    v-if="!escrowRatio"
                    class="home__loader"
                  >
                    <font-awesome-icon
                      class="icon home__icon"
                      icon="spinner"
                      spin
                    />
                  </div>
                  <LineChart
                    v-else
                    :height="60"
                    :props-options="options"
                    :chart-data="getEscrowData()"
                    class="home__chart"
                  />
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                class="home-card__chart"
                title="Transfer volume"
                @click="handleChartClick()"
              >
                <b-card-text class="home__chart">
                  <div
                    v-if="!transactionVolume"
                    class="home__loader"
                  >
                    <font-awesome-icon
                      class="icon home__icon"
                      icon="spinner"
                      spin
                    />
                  </div>
                  <LineChart
                    v-else
                    :height="60"
                    :props-options="options"
                    :chart-data="getTransactionVolumeData()"
                    class="home__chart"
                  />
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                class="card--home"
                title="Price"
              >
                <b-card-text>
                  <font-awesome-icon
                    v-if="!price"
                    class="icon home__icon"
                    icon="spinner"
                    spin
                  />
                  <span v-else>{{ price }} $</span>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                title="Market cap"
                class="card--home"
              >
                <b-card-text>
                  <font-awesome-icon
                    v-if="!marketCup"
                    class="icon home__icon"
                    icon="spinner"
                    spin
                  />
                  <span v-else>{{ getMarketCup }} $</span>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                class="card--home"
                title="Trading volume"
              >
                <b-card-text>
                  <font-awesome-icon
                    v-if="!tradingVolume"
                    class="icon home__icon"
                    icon="spinner"
                    spin
                  />
                  <span v-else>{{ getTradingVolume }} $</span>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              class="home__col"
              cols="12"
              xs="12"
              sm="12"
              md="6"
              lg="3"
            >
              <b-card
                class="card--home"
                title="Circulating supply"
              >
                <b-card-text>
                  <font-awesome-icon
                    v-if="!circulatingSupply"
                    class="icon home__icon"
                    icon="spinner"
                    spin
                  />
                  <span v-else>{{ getCirculatingSupply }} ROSE</span>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </div>
        <b-row class="home__section">
          <b-col
            class="home__col"
            cols="12"
            xs="12"
            sm="12"
            md="12"
            lg="6"
          >
            <p class="home__title">
              Blocks list
            </p>
            <BlocksList
              :list-fetch-params="listFetchParams"
              :is-fetch-on-scroll-enabled="false"
              :fields="[
                { key: 'level', label: 'Height' },
                { key: 'hash', label: 'Hash' },
                { key: 'number_of_txs', label: '# of Ops', class: 'cell-s-center' },
                { key: 'timestamp', label: 'Date' },
              ]"
              class="table-list"
              height="820px"
            />
            <b-button
              to="/blocks"
              class="button button--outline"
              variant="outline-primary"
            >
              Show more
            </b-button>
          </b-col>
          <b-col
            class="home__col"
            cols="12"
            xs="12"
            sm="12"
            md="12"
            lg="6"
          >
            <p class="home__title">
              Operations list
            </p>
            <OperationsList
              :list-fetch-params="listFetchParams"
              :is-fetch-on-scroll-enabled="false"
              :fields="[
                { key: 'level', label: 'Height' },
                { key: 'hash', label: 'Hash' },
                { key: 'type', label: 'Type' },
                { key: 'timestamp', label: 'Date' },
              ]"
              :filters="false"
              class="table-list"
              height="820px"
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
import dayjs from 'dayjs';
import { mapMutations, mapState } from 'vuex';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';
import numeral from 'numeral';

const LineChart = () => import(/* webpackPreload: true */ '@/components/charts/LineChart.vue');
const BlocksList = () => import(/* webpackPreload: true */ '@/components/BlocksList.vue');
const OperationsList = () => import(/* webpackPreload: true */ '@/components/OperationsList.vue');

export default {
  name: 'Home',
  components: {
    BlocksList,
    OperationsList,
    LineChart,
  },
  mixins: [getDatesInSeconds],
  data() {
    return {
      price: null,
      marketCup: null,
      tradingVolume: null,
      circulatingSupply: null,
      escrowRatio: null,
      transactionVolume: null,
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
          xAxes: [
            {
              display: false,
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              type: 'logarithmic',
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
      chartsAreFetched: false,
      listFetchParams: { limit: 10 },
    };
  },
  methods: {
    ...mapMutations(['setInfo']),
    getEscrowData() {
      /* eslint-disable */
      if (!this.escrowRatio) return;

      return {
        labels: [
          ...this.escrowRatio.map(({ timestamp }) =>
            dayjs.unix(timestamp).format('DD/MM/YYYY'),
          ),
        ],
        datasets: [
          {
            backgroundColor: '#4cd4a9',
            borderColor: '#4cd4a9',
            data: [...this.escrowRatio.map(({ escrow_ratio }) => escrow_ratio)],
          },
        ],
      };
    },
    getTransactionVolumeData() {
      /* eslint-disable */
      if (!this.transactionVolume) return;

      return {
        labels: [
          ...this.transactionVolume.map(({ timestamp }) =>
            dayjs.unix(timestamp).format('DD/MM/YYYY'),
          ),
        ],
        datasets: [
          {
            backgroundColor: '#4cd4a9',
            borderColor: '#4cd4a9',
            data: [
              ...this.transactionVolume.map(
                ({ transaction_volume }) => transaction_volume,
              ),
            ],
          },
        ],
      };
    },
    handleCardClick() {
      this.$router.push({
        name: 'block',
        params: { id: this.latestHeight.height },
      });
    },
    handleChartClick() {
      this.$router.push({ name: 'stats' });
    },
    initCharts() {
      const getEscrowRatio = this.$api.getEscrowRatio({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      getEscrowRatio.then((res) => (this.escrowRatio = res.data));

      const transactionVolume = this.$api.getTransactionVolume({
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
      });

      transactionVolume.then((res) => (this.transactionVolume = res.data));
    },
  },
  watch: {
    topStakeWeight: {
      handler(val) {
        if (val !== null && this.chartsAreFetched === false) {
          this.initCharts();
          this.chartsAreFetched = true;
        }
      },
    },
  },
  computed: {
    ...mapState({
      latestHeight: (height) => height,
    }),
    getTransactionVolumeValue() {
      const value = this.getTransactionVolumeData().datasets[0].data[0];
      const formattedValue = numeral(Number(value) / 1000000000).format('0,0.[000000000]');
      return String(formattedValue).split('.')[0];
    },
    getTradingVolume() {
      return numeral(this.tradingVolume).format('0,0');
    },
    getMarketCup() {
      return numeral(this.marketCup).format('0,0');
    },
    getCirculatingSupply() {
      return numeral(this.circulatingSupply).format('0,0');
    }
  },
  async created() {
    const data = await this.$api.getInfo();

    this.topStakeWeight = data.data.top_escrow;
    this.circulatingSupply = data.data.circulating_supply;
    this.marketCup = data.data.market_cap;
    this.price = data.data.price;
    this.tradingVolume = data.data.volume_24h;

    this.setInfo(data.data);
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

  &__section .table-list th,
  &__section .table-list td,
  &__section .table-list td div,
  &__section .table-list td a {
    @media (max-width: 991px) {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }

    @media (max-width: 480px) {
      margin-left: 0;
      margin-right: 0;
      text-align: left;
    }
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

  &__col {
    @include from-992-down {
      margin-bottom: 50px;
    }
  }
}

.home-card__value {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  font-size: 26px;
  color: $color-primary;
}
</style>
