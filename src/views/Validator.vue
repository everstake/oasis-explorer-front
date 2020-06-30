<template>
  <div class="transaction">
    <Breadcrumbs class="breadcrumbs validator__breadcrumbs" :crumbs="breadcrumbs" />

    <b-container>
      <b-row v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center block__loading">
            <font-awesome-icon class="icon block__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row
        v-else-if="
        !loading
        && (Array.isArray(items)
        && (Array.isArray(tableItems))
        && items.length === 0)"
      >
        <b-col cols="12">
          <div class="text-center transaction__empty">
            No data
          </div>
        </b-col>
      </b-row>
      <div v-else>
        <b-row>
          <b-col offset="3" cols="9">
            <div class="validator__actions">
              <b-btn
                class="validator__btn"
                :class="{
                      'validator__btn--active': activeTab === 'transfers'
                    }"
                @click="updateTableData('transfers')"
              >
                Transfers
              </b-btn>
              <b-btn
                class="validator__btn"
                :class="{
                      'validator__btn--active': activeTab === 'addescrow/reclaimescrow'
                    }"
                @click="updateTableData('addescrow/reclaimescrow')"
              >
                Escrow events
              </b-btn>
              <b-btn
                class="validator__btn"
                :class="{
                      'validator__btn--active': activeTab === 'other'
                    }"
                @click="updateTableData('other')"
              >
                Other ops
              </b-btn>
              <b-btn
                class="validator__btn"
                :class="{
                      'validator__btn--active': activeTab === 'delegators'
                    }"
                @click="updateTableData('delegators')"
              >
                Delegators
              </b-btn>
              <b-btn
                class="validator__btn"
                :class="{
                      'validator__btn--active': activeTab === 'charts'
                    }"
                @click="updateTableData('charts')"
              >
                Charts
              </b-btn>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="3">
            <div class="validator__section transaction__section">
              <b-card
                class="validator__info"
                header="Validator information"
              >
                <b-card-text
                  v-if="items.account_name"
                  class="block__content"
                >
                  <div class="block__header">Name</div>
                  {{ items.account_name }}
                </b-card-text>
                <div v-if="isSocialsVisible">
                  <b-card-text class="block__content">
                    <div class="block__header">Website</div>
                    <a href="#" target="_blank">website</a>
                  </b-card-text>
                  <b-card-text class="block__content">
                    <div class="block__header">Email</div>
                    <a href="#" target="_blank">email</a>
                  </b-card-text>
                  <b-card-text class="block__content">
                    <div class="block__header">Social</div>
                    <a href="#" target="_blank">
                      <font-awesome-icon
                        class="validator__icon"
                        :icon="{ prefix: 'fab', iconName: 'telegram' }"
                      />
                    </a>
                    <a href="#" target="_blank">
                      <font-awesome-icon
                        class="validator__icon"
                        :icon="{ prefix: 'fab', iconName: 'twitter' }"
                      />
                    </a>
                    <a href="#" target="_blank">
                      <font-awesome-icon
                        class="validator__icon"
                        :icon="{ prefix: 'fab', iconName: 'facebook' }"
                      />
                    </a>
                    <a href="#" target="_blank">
                      <font-awesome-icon
                        class="validator__icon"
                        :icon="{ prefix: 'fab', iconName: 'medium' }"
                      />
                    </a>
                  </b-card-text>
                </div>
                <b-card-text class="block__content">
                  <div class="block__header">Address</div>
                  <div
                    @click="copyToClipboard(items.account_id)"
                    class="block__copy"
                  >
                    <span
                      :ref="items.account_id"
                    >
                      {{ items.account_id }}
                    </span>
                    <font-awesome-icon
                      :icon="['fas', 'copy']"
                      :class="{
                        'icon--success': isHashCopied(items.account_id)
                      }"
                      class="icon icon-copy delegator-card__icon"
                    />
                  </div>
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header">Signatures</div>
                  {{ items.signatures_count }}
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header">Proposals</div>
                  {{ items.blocks_count }}
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header">Availability score</div>
                  {{ items.available_score }}
                </b-card-text>
                <b-card-text
                  class="block__content"
                >
                  <div class="block__header">Total balance</div>
                  {{ items.general_balance + items.escrow_balance | formatAmount }}
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header">Escrow balance</div>
                  {{ items.escrow_balance | formatAmount }}
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header">Escrow shares</div>
                  {{ items.escrow_shares | formatAmount }}
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header">Unbonding balance</div>
                  {{ items.debonding_balance | formatAmount }}
                </b-card-text>
                <b-card-text class="block__content">
                  <div
                    class="block__header"
                  >
                    Delegators
                  </div>
                  {{ items.depositors_count }}
                </b-card-text>
                <b-card-text class="block__content">
                    <div
                      v-if="items.status"
                      :class="{
                        'validator__status--active': items.status === 'active',
                        'validator__status--inactive': items.status === 'inactive'
                      }"
                    >
                      <div class="block__header">Status</div>
                      <font-awesome-icon
                        v-if="items.status === 'active'"
                        icon="check-circle"
                      />
                      <font-awesome-icon
                        v-else-if="items.status === 'inactive'"
                        icon="times-circle"
                      />
                    </div>
                </b-card-text>
                <b-card-text class="block__content">
                  <div class="block__header" v-if="items.validate_since">Registered</div>
                  {{ items.validate_since | formatDate }}
                  <div class="date-from-now">
                    ({{ items.validate_since | formatDaysAgo }})
                  </div>
                </b-card-text>
              </b-card>
            </div>
          </b-col>
          <b-col cols="9">
          <div class="block__section">
            <div class="block__section block__section--table">
              <b-card class="validator__card">
                <div
                  v-if="activeTab !== 'charts'"
                  class="validator__container validator__shadow"
                >
                  <b-table
                    id="my-table"
                    :busy="loading && tableItems === null"
                    :responsive="true"
                    show-empty
                    :fields="getTableFields"
                    :items="tableItems"
                    class="table table--border table-list validator__table"
                    borderless
                    no-border-collapse
                  >
                    <template #table-busy>
                      <TableLoader />
                    </template>
                    <template #cell(height)="tableItems">
                      <router-link
                        :to="{ name: 'block', params: { id: tableItems.item.level } }"
                      >
                        {{ tableItems.item.level }}
                      </router-link>
                    </template>
                    <template #cell(hash)="tableItems">
                      <router-link
                        :to="{ name: 'transaction', params: { id: tableItems.item.hash } }"
                      >
                        {{ tableItems.item.hash }}
                      </router-link>
                    </template>
                    <template #cell(account_id)="tableItems">
                      <router-link
                        :to="{ name: 'account', params: { id: tableItems.item.account_id } }"
                      >
                        {{ tableItems.item.account_name || tableItems.item.account_id }}
                      </router-link>
                    </template>
                    <template #cell(escrow_amount)="tableItems">
                      {{ tableItems.item.escrow_amount | formatAmount }}
                    </template>
                    <template #cell(delegate_since)="tableItems">
                      {{ tableItems.item.delegate_since | formatYear }}
                      <div class="date-from-now">
                        {{ tableItems.item.delegate_since | formatDaysAgo }}
                      </div>
                    </template>
                    <template #cell(hash)="tableItems">
                      {{ !tableItems.item.hash ? '-' : tableItems.item.hash }}
                    </template>
                    <template #cell(to)="tableItems">
                      <div class="table__hash">
                        <span v-if="!tableItems.item.to">-</span>
                        <span
                          v-else-if="tableItems.item.to ===
                          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='"
                        >
                          System Account
                        </span>
                        <router-link
                          v-else
                          :to="{ name: 'account', params: { id: tableItems.item.to } }"
                        >
                          {{ tableItems.item.to }}
                        </router-link>
                      </div>
                    </template>
                    <template #cell(from)="tableItems" class="table__hash">
                      <div class="table__hash">
                        <span v-if="!tableItems.item.from">-</span>
                        <router-link
                          v-else
                          :to="{ name: 'account', params: { id: tableItems.item.from } }"
                        >
                          {{ tableItems.item.from }}
                        </router-link>
                      </div>
                    </template>
                    <template #cell(proposer)="tableItems">
                      {{ !tableItems.item.proposer ? '-' : tableItems.item.proposer }}
                    </template>
                    <template #cell(timestamp)="tableItems">
                      {{ tableItems.item.timestamp | formatDate }}
                    </template>
                    <template #cell(level)="tableItems">
                      <router-link
                        :to="{ name: 'block', params: { id: tableItems.item.level } }"
                      >
                        {{ tableItems.item.level }}
                      </router-link>
                    </template>
                    <template #cell(hash)="tableItems">
                      <router-link
                        class="table__hash"
                        :to="{ name: 'operation', params: { id: tableItems.item.hash } }"
                      >
                        {{ tableItems.item.hash }}
                      </router-link>
                    </template>
                    <template #cell(amount)="tableItems">
                      {{ tableItems.item.amount | formatAmount }}
                    </template>
                    <template #cell(storage)="tableItems">
                      {{ !tableItems.item.storage ? '-' : tableItems.item.storage }}
                    </template>
                    <template #cell(gas_used)="tableItems">
                      {{ !tableItems.item.gas_used ? '-' : tableItems.item.gas_used }}
                    </template>
                    <template #cell(fees)="tableItems">
                      {{ !tableItems.item.fees ? '-' : tableItems.item.fees }}
                    </template>
                  </b-table>
                  <div
                    v-if="scrollToLoadMore"
                    class="blocks-list__actions"
                  >
                    <b-button
                      @click="onShowMore"
                      variant="outline-primary"
                      class="blocks-list__button font-weight-bold"
                      :class="{
                        'blocks-list__button--loading': loading
                      }"
                        :disabled="loading || isShowMoreDisabled"
                      >
                      <span v-if="loading" disabled>
                        Loading
                        <font-awesome-icon
                          class="blocks-list__icon"
                          icon="sync-alt"
                          :spin="loading"
                        />
                      </span>
                      <span v-else>
                        Show more
                        <font-awesome-icon
                          class="blocks-list__icon"
                          icon="arrow-circle-down"
                          :spin="loading"
                        />
                      </span>
                    </b-button>
                  </div>
                </div>
                <div v-else class="validator-chart">
                  <div>
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
                      <b-row class="stats__information mb-5">
                        <b-col cols="12">
                          <div class="stats__section">
                            <b-card
                              class="validator-chart__header"
                              header="Uptime"
                            >
                              <b-card-text class="stats__content">
                                <LineChart
                                  :chart-data="getUptimeChartData"
                                  :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                                  :y-axes-begin-at-zero="false"
                                  :yTicksCallback="uptimeTicksCallback"
                                  :tooltipsLabelCallback="uptimeTooltipsCallback"
                                />
                              </b-card-text>
                            </b-card>
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="12">
                          <div class="stats__section">
                            <b-card
                              class="validator-chart__header"
                              header="Stake change"
                            >
                              <b-card-text class="stats__content">
                                <LineChart
                                  :chart-data="getStakeChartData"
                                  :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                                  :y-axes-begin-at-zero="false"
                                  :yTicksCallback="chartsTicksCallback"
                                />
                              </b-card-text>
                            </b-card>
                          </div>
                        </b-col>
                      </b-row>
                    </div>
                  </div>
                </div>
              </b-card>
            </div>
          </div>
        </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import TableLoader from '@/components/TableLoader.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
import debounce from 'lodash/debounce';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';
import numeral from 'numeral';
import store from '@/store';
import dayjs from 'dayjs';
import LineChart from '@/components/charts/LineChart.vue';

export default {
  name: 'Validator',
  components: {
    Breadcrumbs,
    TableLoader,
    LineChart,
  },
  mixins: [
    copyToClipboard,
    getDatesInSeconds,
  ],
  props: {
    scrollToLoadMore: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: null,
      limit: 10,
      offset: 0,
      items: null,
      delegators: [],
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'validators',
          text: 'Validators',
        },
        {
          text: `${this.$route.params.id}`,
          active: true,
        },
      ],
      currentPage: 1,
      activeTab: 'transfers',
      tableItems: [],
      charts: {
        uptime: null,
        stake: null,
      },
      isShowMoreDisabled: false,
      handleDebouncedScroll: null,
      palette: [
        'rgba(76, 212, 169, .4)',
        'rgba(27, 184, 168, .4)',
        'rgba(0, 155, 159, .4)',
        'rgba(24, 126, 141, .4)',
        'rgba(42, 98, 117, .4)',
        'rgba(47, 72, 88, .4)',
      ],
      xAxesMaxTicksLimit: 28,
      isSocialsVisible: false,
    };
  },
  watch: {
    isShowMoreDisabled: {
      immediate: false,
      handler(val) {
        if (val && this.handleDebouncedScroll !== null) {
          this.removeEventListenerOnScroll();
        } else if (this.handleDebouncedScroll === null) {
          this.setEventListenerOnScroll();
        }
      },
    },
    $route: {
      immediate: true,
      async handler() {
        this.loading = true;

        const data = await this.$api.getValidator({
          limit: this.limit,
          id: this.$route.params.id,
        });

        if (data.status !== 200) {
          this.$router.push({ name: '404' });
        }
        this.items = data.data;

        this.updateTableData('transfers');

        this.loading = false;
      },
    },
  },
  methods: {
    chartsTicksCallback(label) {
      if (label > 1) {
        return numeral(label / 1000000000).format('0,0.[000000000]');
      }

      return label.toFixed();
    },
    uptimeTicksCallback(label) {
      return label;
    },
    // eslint-disable-next-line consistent-return
    uptimeTooltipsCallback(t, d) {
      const xLabel = d.datasets[t.datasetIndex].label;
      const { yLabel } = t;

      for (let i = 0; i <= 10; i += 1) {
        if (t.datasetIndex === i) {
          return `${xLabel}: ${yLabel}`;
        }
      }
    },
    handleScroll() {
      if (this.$refs.table) {
        if (window.innerHeight > this.$refs.table.$el.getBoundingClientRect().bottom) {
          this.onShowMore();
        }
      }
    },
    async onShowMore() {
      const { activeTab } = this;
      this.tableItems = [
        ...this.tableItems,
        ...await this.fetchData(activeTab),
      ];
      this.offset += 50;
    },
    setEventListenerOnScroll() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 100);
      window.addEventListener('scroll', this.handleDebouncedScroll);
    },
    removeEventListenerOnScroll() {
      if (this.handleDebouncedScroll !== null) {
        this.handleDebouncedScroll.cancel();
      }
      window.removeEventListener('scroll', this.handleDebouncedScroll);
      this.handleDebouncedScroll = null;
    },
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    async updateTableData(type) {
      this.offset = 0;
      this.tableItems = await this.fetchData(type);
      this.setActiveTab(type);
    },
    async fetchData(type) {
      this.loading = true;
      let data = null;
      let uptimeChart = null;
      let stakeChart = null;
      const requestOptions = {
        limit: this.limit,
        offset: this.offset,
      };

      if (type === 'charts') {
        uptimeChart = await this.$api.getChartUptime({
          limit: this.limit,
          from: this.thirtyDaysAgoInSeconds,
          to: this.todayInSeconds,
          frame: 'D',
          id: this.$route.params.id,
        });

        stakeChart = await this.$api.getChartStake({
          limit: this.limit,
          from: this.thirtyDaysAgoInSeconds,
          to: this.todayInSeconds,
          frame: 'D',
          id: this.$route.params.id,
        });

        this.charts.uptime = uptimeChart.data;
        this.charts.stake = stakeChart.data;
      }

      switch (type) {
        case 'transfers':
          data = await this.$api.getTransactions({
            ...requestOptions,
            operation_kind: 'transfer',
            account_id: this.$route.params.id,
          });
          break;
        case 'delegators':
          data = await this.$api.getValidatorDelegators({
            ...requestOptions,
            id: this.$route.params.id,
          });
          break;
        case 'addescrow/reclaimescrow':
          data = await this.$api.getTransactions({
            ...requestOptions,
            operation_kind: ['addescrow', 'reclaimescrow'],
            account_id: this.$route.params.id,
          });
          break;
        case 'other':
          data = await this.$api.getTransactions({
            ...requestOptions,
            operation_kind: ['registernode', 'registerentity', 'amendcommissionschedule', 'registerruntime'],
            account_id: this.$route.params.id,
          });
          break;
        default:
          data = await this.$api.getTransactions({
            ...requestOptions,
            operation_kind: 'transfers',
            account_id: this.$route.params.id,
          });
      }

      if (Array.isArray(data.data) && (data.data.length === 0 || data.data.length < this.limit)) {
        this.isShowMoreDisabled = true;
      } else if (Array.isArray(data.data) && data.data.length > 0) {
        this.isShowMoreDisabled = false;
      }

      this.loading = false;
      return data.data;
    },
  },
  computed: {
    getUptimeChartData() {
      return {
        datasets: [
          {
            label: 'Availability score',
            // eslint-disable-next-line camelcase
            data: this.charts.uptime.map(({ availability_score }) => availability_score),
            borderWidth: 1,
            backgroundColor: this.palette[0],
          },
          {
            label: 'Proposals count',
            // eslint-disable-next-line camelcase
            data: this.charts.uptime.map(({ blocks_count }) => blocks_count),
            borderWidth: 1,
            backgroundColor: this.palette[1],
          },
          {
            label: 'Signatures count',
            // eslint-disable-next-line camelcase
            data: this.charts.uptime.map(({ signatures_count }) => signatures_count),
            borderWidth: 1,
            backgroundColor: this.palette[2],
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.charts.uptime.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getStakeChartData() {
      return {
        datasets: [
          {
            label: 'Total balance',
            // eslint-disable-next-line camelcase
            data: this.charts.stake.map(({ total_balance }) => total_balance),
            borderWidth: 1,
            backgroundColor: this.palette[0],
          },
          {
            label: 'Escrow balance',
            // eslint-disable-next-line camelcase
            data: this.charts.stake.map(({ escrow_balance }) => escrow_balance),
            borderWidth: 1,
            backgroundColor: this.palette[1],
          },
          {
            label: 'Debonding balance',
            // eslint-disable-next-line camelcase
            data: this.charts.stake.map(({ debonding_balance }) => debonding_balance),
            borderWidth: 1,
            backgroundColor: this.palette[2],
          },
          {
            label: 'Self stake balance',
            // eslint-disable-next-line camelcase
            data: this.charts.stake.map(({ self_stake_balance }) => self_stake_balance),
            borderWidth: 1,
            backgroundColor: this.palette[3],
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.charts.stake.map(({ timestamp }) => {
          if (store.state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
    getTableFields() {
      if (this.activeTab === 'transfers') {
        return [
          { key: 'level', label: 'Height' },
          { key: 'hash', label: 'Transaction hash' },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount', sortable: true },
          { key: 'timestamp', label: 'Date', sortable: true },
        ];
      }

      if (this.activeTab === 'addescrow/reclaimescrow') {
        return [
          { key: 'level', label: 'Height' },
          { key: 'hash', label: 'Operation hash' },
          { key: 'type', label: 'Type' },
          { key: 'escrow_amount', label: 'Escrow amount', sortable: true },
          { key: 'timestamp', label: 'Date', sortable: true },
        ];
      }

      if (this.activeTab === 'delegators') {
        return [
          { key: 'account_id', label: 'Account' },
          { key: 'escrow_amount', label: 'Escrow amount', sortable: true },
          { key: 'delegate_since', label: 'Delegate since', sortable: true },
        ];
      }

      if (this.activeTab === 'other') {
        return [
          { key: 'level', label: 'Height' },
          { key: 'hash', label: 'Hash' },
          { key: 'amount', label: 'Amount', sortable: true },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'nonce', label: 'Nonce' },
          { key: 'type', label: 'Type' },
          { key: 'timestamp', label: 'Timestamp', sortable: true },
        ];
      }

      return [];
    },
  },
};
</script>

<style lang="scss">
.validator {
  &__breadcrumbs {
    margin-bottom: 35px;
  }

  &__section {
  }

  &__card {
    box-shadow: none;
  }

  &__container {
    max-height: 95vh;
    overflow-y: auto;
  }

  &__shadow {
    height: 100%;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  }

  &__actions {
    margin-bottom: 15px;
  }

  &__btn {
    width: 20%;
    padding: 7px 0;
    border-left: none;
    border-radius: 0;
    background-color: #fff !important;
    border-color: #4cd4a9 !important;
    color: #4cd4a9 !important;
    font-weight: bold;

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      border-left: 1px solid #4cd4a9;
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      border-right: 1px solid #4cd4a9;
    }

    &:focus,
    &:active {
      box-shadow: none !important;
    }

    &:hover {
      background-color: rgb(76, 212, 169) !important;
      color: #fff !important;
      /*box-shadow: 0 0 0 0.2rem rgba(76, 212, 169, .5) !important;*/
    }

    /*&:hover,*/
    /*&:active:focus {*/
    /*  box-shadow: 0 0 0 0.2rem rgba(76, 212, 169, .5) !important;*/
    /*}*/

    &--active {
      background-color: #4cd4a9 !important;
      color: #fff !important;
      pointer-events: none;
      /*box-shadow: 0 0 0 0.2rem rgba(76, 212, 169, .5) !important;*/

      &:focus,
      &:hover {
        box-shadow: none !important;
      }
    }
  }

  &__table {
  }

  &__status {
    &--active {
      color: #28a745;
    }

    &--inactive {
      color: #dc3545;
    }
  }

  &-chart__header {
    & .card-header {
      margin-bottom: 20px;
    }
  }

  &-chart {
    .card-header {
      padding: 14px 20px;
    }
  }
}
</style>
