<template>
  <div class="account" :key="$route.params.id">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <b-container fluid="lg">
      <b-row class="account__empty" v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center account__loading">
            <font-awesome-icon class="icon account__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row
        class="account__content"
        v-else-if="!loading && (Array.isArray(items) && items.length === 0)"
      >
        <b-col cols="12">
          <div class="text-center block__empty">
            No data
          </div>
        </b-col>
      </b-row>
      <b-row class="account__information" v-else>
        <b-col cols="4">
          <div class="account__section">
            <b-card
              header="Account information"
            >
              <b-card-text class="account__content">
                <b-row>
                  <b-col cols="12">
                    <div class="account__container">
                      <div class="account__item">
                        Address:
                        <p class="account__value">{{ items.address }}</p>
                      </div>
                      <div class="account__item" v-if="items.entity_address">
                        Entity address:
                        <p class="account__value">
                          <router-link
                            v-if="items.entity_address !== $route.params.id"
                            :to="{ name: 'account', params: { id: items.entity_address } }"
                          >
                            {{ items.entity_address }}
                          </router-link>
                          <span v-else>
                            {{ items.entity_address }}
                          </span>
                        </p>
                      </div>
                      <div class="account__item">
                        Type:
                        <p class="account__value">{{items.type }}</p>
                      </div>
                    </div>
                  </b-col>
                  <b-col cols="12">
                    <div class="account__container">
                      <div class="account__item">
                        Total balance:
                        <p class="account__value">{{items.total_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Liquid balance:
                        <p class="account__value">{{ items.liquid_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Escrow balance:
                        <p class="account__value">{{items.escrow_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Debonding balance:
                        <p class="account__value">{{items.debonding_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Nonce:
                        <p class="account__value">{{items.nonce }}</p>
                      </div>
                      <div class="account__item">
                        Last active:
                        <p class="account__value">{{items.last_active | formatUTCDaysAgo }}</p>
                      </div>
                      <div class="account__item">
                        Created at:
                        <p class="account__value">{{items.created_at | formatUTCDate }}</p>
                      </div>
                    </div>
                 </b-col>
                </b-row>
              </b-card-text>
            </b-card>
          </div>
        </b-col>
        <b-col cols="8" md="8">
            <div class="account__actions account__actions--desktop">
              <b-btn
                class="account__btn"
                :class="{
                  'account__btn--active': activeTab === 'transfers',
                }"
                @click="updateTableData('transfers')"
              >
                Transfers
              </b-btn>
              <b-btn
                class="account__btn"
                :class="{
                  'account__btn--active':
                    activeTab === 'addescrow/reclaimescrow',
                }"
                @click="updateTableData('addescrow/reclaimescrow')"
              >
                Escrow events
              </b-btn>
              <b-btn
                class="account__btn"
                :class="{
                  'account__btn--active': activeTab === 'other',
                }"
                @click="updateTableData('other')"
              >
                Other ops
              </b-btn>
              <b-btn
                class="account__btn"
                :class="{
                  'account__btn--active': activeTab === 'charts',
                }"
                @click="updateTableData('charts')"
              >
                Charts
              </b-btn>
            </div>
          <div class="block__section">
            <div
              class="block__section block__section--table"
              :class="{'account__chart': activeTab === 'charts'}"
            >
              <b-card :class="{ 'account__card': activeTab !== 'charts' }">
                <div
                  v-if="activeTab !== 'charts'"
                  class="validator__container validator__shadow"
                >
                  <b-table
                    ref="table"
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
                        :to="{
                            name: 'block',
                            params: { id: tableItems.item.level },
                          }"
                      >
                        {{ tableItems.item.level }}
                      </router-link>
                    </template>
                    <template #cell(block_level)="tableItems">
                      <router-link
                        :to="{
                            name: 'block',
                            params: { id: tableItems.item.block_level },
                          }"
                      >
                        {{ tableItems.item.block_level }}
                      </router-link>
                    </template>
                    <template #cell(hash)="tableItems">
                      <router-link
                        :to="{
                            name: 'transaction',
                            params: { id: tableItems.item.hash },
                          }"
                      >
                        {{ tableItems.item.hash }}
                      </router-link>
                    </template>
                    <template #cell(account_id)="tableItems">
                      <router-link
                        :to="{
                            name: 'account',
                            params: { id: tableItems.item.account_id },
                          }"
                      >
                        {{
                        tableItems.item.account_name ||
                        tableItems.item.account_id
                        }}
                      </router-link>
                    </template>
                    <template #cell(escrow_amount)="tableItems">
                      {{ tableItems.item.escrow_amount | formatAmount }}
                    </template>
                    <template #cell(delegate_since)="tableItems">
                      {{ tableItems.item.delegate_since | formatYear }}
                      - {{ tableItems.item.delegate_since | formatDaysAgo }}
                    </template>
                    <template #cell(hash)="tableItems">
                      {{ !tableItems.item.hash ? '-' : tableItems.item.hash }}
                    </template>
                    <template #cell(to)="tableItems">
                      <div class="table__hash">
                        <span v-if="!tableItems.item.to">-</span>
                        <span
                          v-else-if="
                              tableItems.item.to ===
                              'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
                            "
                        >
                            System Account
                          </span>
                        <router-link
                          v-else
                          :to="{
                              name: 'account',
                              params: { id: tableItems.item.to },
                            }"
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
                          :to="{
                              name: 'account',
                              params: { id: tableItems.item.from },
                            }"
                        >
                          {{ tableItems.item.from }}
                        </router-link>
                      </div>
                    </template>
                    <template #cell(proposer)="tableItems">
                      {{
                      !tableItems.item.proposer
                      ? '-'
                      : tableItems.item.proposer
                      }}
                    </template>
                    <template #cell(timestamp)="tableItems">
                      {{ tableItems.item.timestamp | formatDate }}
                    </template>
                    <template #cell(created_at)="tableItems">
                      {{ tableItems.item.created_at | formatDate }}
                    </template>
                    <template #cell(level)="tableItems">
                      <router-link
                        :to="{
                            name: 'block',
                            params: { id: tableItems.item.level },
                          }"
                      >
                        {{ tableItems.item.level }}
                      </router-link>
                    </template>
                    <template #cell(hash)="tableItems">
                      <router-link
                        class="table__hash"
                        :to="{
                            name: 'operation',
                            params: { id: tableItems.item.hash },
                          }"
                      >
                        {{ tableItems.item.hash }}
                      </router-link>
                    </template>
                    <template #cell(amount)="tableItems">
                      {{ tableItems.item.amount | formatAmount }}
                    </template>
                    <template #cell(storage)="tableItems">
                      {{
                      !tableItems.item.storage
                      ? '-'
                      : tableItems.item.storage
                      }}
                    </template>
                    <template #cell(gas_used)="tableItems">
                      {{
                      !tableItems.item.gas_used
                      ? '-'
                      : tableItems.item.gas_used
                      }}
                    </template>
                    <template #cell(fees)="tableItems">
                      {{ !tableItems.item.fees ? '-' : tableItems.item.fees }}
                    </template>
                  </b-table>
                  <div
                    v-if="fetchOnScrollEnabled"
                    class="account-list__actions text-center"
                  >
                    <b-button
                      @click="handleShowMore"
                      variant="outline-primary"
                      class="blocks-list__button font-weight-bold"
                      :class="{
                          'blocks-list__button--loading': loading,
                        }"
                      :disabled="loading || isShowMoreButtonDisabled"
                    >
                        <span v-if="loading" disabled>
                          Loading
                          <font-awesome-icon
                            class="blocks-list__icon"
                            icon="sync-alt"
                            :spin="loading"
                          />
                        </span>
                      <span v-else ref="showMoreButton">
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
                    <div class="stats__charts pt-2" v-else>
                      <b-row>
                        <b-col cols="12">
                          <div class="stats__section">
                            <b-card
                              class="validator-chart__header"
                              header="Stake change"
                            >
                              <b-card-text class="stats__content account__stats">
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
      <b-row class="account__validator" v-if="items !== null && items.validator">
        <b-col cols="12">
          <b-card
            header="Validator information"
          >
            <b-card-text class="account__content">
              <b-row>
                <b-col cols="6">
                  <div class="account__container">
                    <div class="account__item">
                      Node address:
                      <p class="account__value">
                        <router-link
                          :to="{ name: 'account', params: { id: items.validator.node_address } }"
                        >
                          {{ items.validator.node_address }}
                        </router-link>
                      </p>
                    </div>
                    <div class="account__item">
                      Consensus address:
                      <p class="account__value">{{ items.validator.consensus_address }}</p>
                    </div>
                    <div class="account__item">
                      Delegators count:
                      <p class="account__value">{{ items.validator.depositors_count }}</p>
                    </div>
                    <div class="account__item">
                      Blocks count:
                      <p class="account__value">{{ items.validator.blocks_count }}</p>
                    </div>
                    <div class="account__item">
                    Signatures count:
                    <p class="account__value">{{ items.validator.signatures_count }}</p>
                  </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="account__container">
                    <div class="account__item">
                      Rate change interval:
                      <p class="account__value">{{ items.validator.rate_change_interval }}</p>
                    </div>
                    <div class="account__item">
                      Rate bound lead:
                      <p class="account__value">{{ items.validator.rate_bound_lead }}</p>
                    </div>
                    <div class="account__item">
                      Max rate steps:
                      <p class="account__value">{{ items.validator.max_rate_steps }}</p>
                    </div>
                    <div class="account__item">
                      Max bound steps:
                      <p class="account__value">{{ items.validator.max_bound_steps }}</p>
                    </div>
                    <div class="account__item">
                      Status:
                      <p class="account__value">{{ items.validator.status }}</p>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
import fetchOnScroll from '@/mixins/fetchOnScroll';
import { state } from '@/store';
import dayjs from 'dayjs';
import numeral from 'numeral';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';
import LineChart from '@/components/charts/LineChart.vue';

export default {
  name: 'Account',
  components: {
    Breadcrumbs,
    LineChart,
  },
  mixins: [
    copyToClipboard,
    fetchOnScroll,
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
          toRouteName: 'accounts',
          text: 'Accounts',
        },
        {
          text: this.$route.params.id,
          active: true,
        },
      ],
      fields: [
        { key: 'address', label: 'Address' },
        { key: 'liquid_balance', label: 'Liquid balance' },
        { key: 'escrow_balance', label: 'Escrow balance' },
        { key: 'debonding_balance', label: 'Debonding balance' },
        { key: 'total_balance', label: 'Total balance' },
        { key: 'created_at', label: 'Created at' },
        { key: 'last_active', label: 'Last active' },
        { key: 'nonce', label: 'Nonce' },
        { key: 'type', label: 'Type' },
        { key: 'entity_address', label: 'Entity Address' },
        { key: 'validator', label: 'Validator' },
      ],
      activeTab: 'transfers',
      tableItems: [],
      charts: {
        stake: null,
      },
      xAxesMaxTicksLimit: 10,
      limit: 10,
      offset: 0,
      palette: [
        'rgba(76, 212, 169, .4)',
        'rgba(27, 184, 168, .4)',
        'rgba(0, 155, 159, .4)',
        'rgba(24, 126, 141, .4)',
        'rgba(42, 98, 117, .4)',
        'rgba(47, 72, 88, .4)',
      ],
    };
  },
  methods: {
    async fetchData(type = 'transfers') {
      this.loading = true;
      /* eslint-disable */
      let data = null;
      let stakeChart = null;
      const requestOptions = {
        limit: this.limit,
        offset: this.offset,
      };
      if (type === 'charts') {
        stakeChart = await this.$api.getChartStake({
          limit: this.limit,
          from: this.datesInSeconds.monthAgo,
          to: this.datesInSeconds.today,
          frame: 'D',
          id: this.$route.params.id,
        });

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
            operation_kind: [
              'registernode',
              'registerentity',
              'amendcommissionschedule',
              'registerruntime',
            ],
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

      if (
        Array.isArray(data.data) &&
        (data.data.length === 0 || data.data.length < this.limit)
      ) {
        this.isShowMoreButtonDisabled = true;
      } else {
        this.isShowMoreButtonDisabled = false;
      }

      this.loading = false;
      return data.data;
      
      this.loading = false;
    },
    async updateTableData(type) {
      this.offset = 0;
      this.tableItems = await this.fetchData(type);
      this.setActiveTab(type);
    },
    chartsTicksCallback(label) {
      if (label > 1) {
        return numeral(label / 1000000000).format('0,0.[000000000]');
      }

      return label.toFixed();
    },
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    async handleShowMore() {
      this.offset += 10;
      const { activeTab } = this;
      this.tableItems = [
        ...this.tableItems,
        ...(await this.fetchData(activeTab)),
      ];
    },
  },
  computed: {
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
          { key: 'timestamp', label: 'Date', sortable: true },
        ];
      }

      if (this.activeTab === 'rewards') {
        return [
          { key: 'block_level', label: 'Height' },
          { key: 'epoch', label: 'Epoch' },
          { key: 'amount', label: 'Amount', sortable: true },
          { key: 'created_at', label: 'Date', sortable: true },
        ];
      }

      return [];
    },
    getStakeChartData() {
      return {
        datasets: [
          {
            label: 'Total balance',
            /* eslint-disable */
            data: this.charts.stake.map(
              ({ general_balance, escrow_balance }) => {
                return general_balance + escrow_balance;
              },
            ),
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
            data: this.charts.stake.map(
              ({ debonding_balance }) => debonding_balance,
            ),
            borderWidth: 1,
            backgroundColor: this.palette[2],
          },
          {
            label: 'Self stake balance',
            // eslint-disable-next-line camelcase
            data: this.charts.stake.map(
              ({ self_stake_balance }) => self_stake_balance,
            ),
            borderWidth: 1,
            backgroundColor: this.palette[3],
          },
        ],
        // eslint-disable-next-line max-len
        labels: this.charts.stake.map(({ timestamp }) => {
          if (state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        this.loading = true;

        const data = await this.$api.getAccount({
          id: this.$route.params.id,
        });

        if (data.status !== 200) {
          this.$router.push({ name: '404' });
        }

        const unixEpoch = '1970-01-01T00:00:00Z';
        const mainnetStart = '2020-11-18T16:01:00Z';
        let { created_at, last_active } = data.data;

        if (created_at == unixEpoch && last_active == unixEpoch) {
          data.data.created_at = mainnetStart;
          data.data.last_active = mainnetStart;
        }

        this.items = data.data;

        this.updateTableData('transfers');
        this.loading = false;
      },
    },
  },
};
</script>

<style lang="scss">
  .account {
    &__content {}
    &__container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: space-between;
      height: 100%;
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
    &__stats {
      padding-top: 20px;
    }
    &__chart {
      height: auto !important;
    }
  }
</style>


<style lang="scss">
  .account {
    &-list__actions {
      padding-bottom: 20px;
      text-align: center;
    }
    
    &__breadcrumbs {
      margin-bottom: 35px;
    }
    
    &__section {
    }
    
    &__card {
      height: calc(100% - 55px) !important;
      max-height: 700px;
      overflow-y: auto;
      box-shadow: none;
      padding-bottom: 20px;
    }
    
    &__container {
      max-height: 800px;
      overflow-y: auto;
    }
    
    &__shadow {
      height: 100%;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
      
      &:last-child {
        box-shadow: none;
      }
    }
    
    &__actions {
      margin-bottom: 15px;
      
      &--desktop {
        @include from-768-down {
          display: none;
        }
        
        @media (min-width: 769px) {
          display: block;
        }
      }
      
      &--mobile {
        display: none;
        margin-top: 15px;
        
        @include from-768-down {
          display: block;
        }
      }
    }
    
    &__btn {
      width: 25%;
      padding: 7px 0;
      border-left: none;
      border-radius: 0;
      background-color: #fff !important;
      border-color: #4cd4a9 !important;
      color: #4cd4a9 !important;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      
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
      }
      
      &--active {
        background-color: #4cd4a9 !important;
        color: #fff !important;
        pointer-events: none;
        
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
    
    &__contacts {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 10px;
    }
    
    &__name {
      font-size: 21px;
    }
    
    &__contact .validator__icon {
      color: #999;
    }
    
    &__contact {
      pointer-events: none;
      
      & svg {
        margin: 0;
      }
      
      &--active {
        pointer-events: auto;
        
        & .validator__icon {
          color: $color-primary;
        }
      }
    }
  }
</style>

<style lang="scss">
  .table__rewards th {
    background-color: #353a38 !important;
  }
</style>
