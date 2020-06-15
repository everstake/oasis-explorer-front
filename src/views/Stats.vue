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
      <b-row class="stats__information" v-else>
        <b-col cols="6">
          <div class="stats__section">
            <b-card
              header="Chart information"
            >
              <b-card-text class="stats__content">
                <div class="stats__container">
                  <PieChart
                    :chart-data="getPieChartData"
                    :tooltips-label-callback="tooltipsLabelCallback"
                  />
                </div>
              </b-card-text>
            </b-card>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="stats__section">
            <b-card
              header="Chart information"
            >
              <b-card-text class="stats__content">
                <div class="stats__container">
                  <LineChart
                    :chart-data="getLineChartData"
                    :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                    :y-axes-begin-at-zero="false"
                  />
                </div>
              </b-card-text>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import PieChart from '@/components/charts/PieChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import store from '@/store';
import dayjs from 'dayjs';

export default {
  name: 'Stats',
  components: {
    LineChart,
    PieChart,
    Breadcrumbs,
  },
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
      pieChartData: [
        {
          name: 'Label',
          value: '1',
        },
        {
          name: 'Label',
          value: '2',
        },
        {
          name: 'Label',
          value: '3',
        },
        {
          name: 'Label',
          value: '4',
        },
      ],
      lineChartData: [
        {
          bakers: 157,
          timestamp: 1589673600,
        },
        {
          bakers: 150,
          timestamp: 1589760000,
        },
        {
          bakers: 157,
          timestamp: 1589846400,
        },
        {
          bakers: 162,
          timestamp: 1589932800,
        },
        {
          bakers: 155,
          timestamp: 1590019200,
        },
        {
          bakers: 164,
          timestamp: 1590105600,
        },
        {
          bakers: 141,
          timestamp: 1590192000,
        },
        {
          bakers: 154,
          timestamp: 1590278400,
        },
        {
          bakers: 161,
          timestamp: 1590364800,
        },
        {
          bakers: 143,
          timestamp: 1590451200,
        },
        {
          bakers: 153,
          timestamp: 1590537600,
        },
        {
          bakers: 148,
          timestamp: 1590624000,
        },
        {
          bakers: 155,
          timestamp: 1590710400,
        },
        {
          bakers: 151,
          timestamp: 1590796800,
        },
        {
          bakers: 156,
          timestamp: 1590883200,
        },
        {
          bakers: 156,
          timestamp: 1590969600,
        },
        {
          bakers: 155,
          timestamp: 1591056000,
        },
        {
          bakers: 137,
          timestamp: 1591142400,
        },
        {
          bakers: 153,
          timestamp: 1591228800,
        },
        {
          bakers: 161,
          timestamp: 1591315200,
        },
        {
          bakers: 150,
          timestamp: 1591401600,
        },
        {
          bakers: 162,
          timestamp: 1591488000,
        },
        {
          bakers: 165,
          timestamp: 1591574400,
        },
        {
          bakers: 148,
          timestamp: 1591660800,
        },
        {
          bakers: 159,
          timestamp: 1591747200,
        },
        {
          bakers: 148,
          timestamp: 1591833600,
        },
        {
          bakers: 146,
          timestamp: 1591920000,
        },
        {
          bakers: 150,
          timestamp: 1592006400,
        },
        {
          bakers: 155,
          timestamp: 1592092800,
        },
        {
          bakers: 138,
          timestamp: 1592179200,
        },
      ],
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
    async fetchData() {
      this.loading = true;
      this.loading = false;
    },
    tooltipsLabelCallback(tooltipItem, data) {
      return `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}`;
    },
  },
  computed: {
    getPieChartData() {
      return {
        datasets: [
          {
            data: this.pieChartData.map(({ value }) => value),
            backgroundColor: this.palette,
            borderWidth: 1,
          },
        ],
        labels: this.pieChartData.map(({ name }) => name),
      };
    },
    getLineChartData() {
      return {
        datasets: [
          {
            data: this.lineChartData.map(({ bakers }) => bakers),
            borderWidth: 1,
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.lineChartData.map(({ timestamp }) => dayjs.unix(timestamp).format(store.state.dateFormat)),
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
