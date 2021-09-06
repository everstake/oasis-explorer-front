<template>
  <div :key="$route.params.id">
    <Breadcrumbs
      class="breadcrumbs"
      :crumbs="breadcrumbs"
    />

    <b-container fluid="lg">
      <b-row
        v-if="loading && !account"
        class="account__empty"
      >
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
        v-else-if="account"
        class="account__information"
      >
        <b-col cols="4">
          <b-card
            header="Account information"
          >
            <b-card-text class="account__content">
              <b-row>
                <b-col cols="12">
                  <div class="account__container">
                    <div class="account__item">
                      Address:
                      <p class="account__value">
                        {{ account.address }}
                      </p>
                    </div>
                    <div
                      v-if="account.entity_address"
                      class="account__item"
                    >
                      Entity address:
                      <p class="account__value">
                        <router-link
                          v-if="account.entity_address !== $route.params.id"
                          :to="{ name: 'account', params: { id: account.entity_address } }"
                        >
                          {{ account.entity_address }}
                        </router-link>
                        <span v-else>
                          {{ account.entity_address }}
                        </span>
                      </p>
                    </div>
                    <div class="account__item">
                      Type:
                      <p class="account__value">
                        {{ account.type }}
                      </p>
                    </div>
                  </div>
                </b-col>
                <b-col cols="12">
                  <div class="account__container">
                    <div class="account__item">
                      Total balance:
                      <p class="account__value">
                        {{ account.total_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Liquid balance:
                      <p class="account__value">
                        {{ account.liquid_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Escrow balance:
                      <p class="account__value">
                        {{ account.escrow_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Debonding balance:
                      <p class="account__value">
                        {{ account.escrow_debonding_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Delegations balance:
                      <p class="account__value">
                        {{ account.delegations_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Debonding delegations balance:
                      <p class="account__value">
                        {{ account.debonding_delegations_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Self stake:
                      <p class="account__value">
                        {{ account.self_delegation_balance | formatAmount }}
                      </p>
                    </div>
                    <div class="account__item">
                      Nonce:
                      <p class="account__value">
                        {{ account.nonce }}
                      </p>
                    </div>
                    <div class="account__item">
                      Last active:
                      <p class="account__value">
                        {{ account.last_active | formatUTCDaysAgo }}
                      </p>
                    </div>
                    <div class="account__item">
                      Created at:
                      <p class="account__value">
                        {{ account.created_at | formatUTCDate }}
                      </p>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </b-col>

        <b-col
          cols="8"
          md="8"
        >
          <div class="account__cards-wrapper">
            <b-card
              class="account__actions account__actions--desktop"
              no-body
            >
              <b-btn
                v-for="tab in tabs"
                :key="tab.key"
                :class="['account__btn', {
                  'account__btn--active': activeTab === tab,
                }]"
                @click="onClickTab(tab)"
              >
                {{ tab.label }}
              </b-btn>
            </b-card>

            <b-card
              v-if="activeTab.key !== 'charts'"
              no-body
            >
              <CommonTable
                v-if="activeTab.key === 'rewards'"
                head-variant="dark"
                request-name="getAccountRewardsStat"
                :fields="rewardsFields"
                :fetch-params="fetchParams"
                height="min-content"
              >
                <template #cell(total_reward)="{ item: { total_reward } }">
                  {{ total_reward | formatAmount }}
                </template>

                <template #cell(day_reward)="{ item: { day_reward } }">
                  {{ day_reward | formatAmount }}
                </template>

                <template #cell(week_reward)="{ item: { week_reward } }">
                  {{ week_reward | formatAmount }}
                </template>

                <template #cell(month_reward)="{ item: { month_reward } }">
                  {{ month_reward | formatAmount }}
                </template>
              </CommonTable>

              <CommonTable
                :request-name="requestName"
                :fields="fields"
                :fetch-params="fetchParams"
                height="min-content"
              >
                <template #cell(block_level)="{ item: { block_level }}">
                  <router-link
                    :to="{ name: 'block', params: { id: block_level } }"
                  >
                    {{ block_level }}
                  </router-link>
                </template>

                <template #cell(account_id)="{ item: { account_id, account_name }}">
                  <router-link
                    :to="{ name: 'account', params: { id: account_id } }"
                  >
                    {{ account_name || account_id }}
                  </router-link>
                </template>

                <template #cell(escrow_amount)="{ item: { escrow_amount } }">
                  {{ escrow_amount | formatAmount }}
                </template>

                <template #cell(delegate_since)="{ item: { delegate_since } }">
                  {{ delegate_since | formatYear }} - {{ delegate_since | formatDaysAgo }}
                </template>

                <template #cell(to)="{ item: { to }}">
                  <div>
                    <span v-if="to === $constants.SYSTEM_ACCOUNT_ID">
                      System Account
                    </span>

                    <router-link
                      v-else-if="to"
                      :to="{ name: 'account', params: { id: to } }"
                    >
                      {{ to | trimHashFromTo(6, -6) }}
                    </router-link>

                    <span v-else>-</span>
                  </div>
                </template>

                <template #cell(from)="{ item: { from }}">
                  <div>
                    <router-link
                      v-if="from"
                      :to="{ name: 'account', params: { id: from } }"
                    >
                      {{ from | trimHashFromTo(6, -6) }}
                    </router-link>

                    <span v-else>-</span>
                  </div>
                </template>

                <template #cell(proposer)="{ item: { proposer }}">
                  {{ proposer || '-' }}
                </template>

                <template #cell(timestamp)="{ item: { timestamp }}">
                  {{ timestamp | formatDate }}
                </template>

                <template #cell(created_at)="{ item: { created_at } }">
                  {{ created_at | formatDate }}
                </template>

                <template #cell(level)="{ item: { level } }">
                  <router-link
                    :to="{ name: 'block', params: { id: level } }"
                  >
                    {{ level }}
                  </router-link>
                </template>

                <template #cell(hash)="{ item: { hash }}">
                  <router-link
                    :to="{ name: 'operation', params: { id: hash } }"
                  >
                    {{ hash | trimHashFromTo(5, -5) }}
                  </router-link>
                </template>

                <template #cell(amount)="{ item: { amount } }">
                  {{ amount | formatAmount }}
                </template>

                <template #cell(storage)="{ item: { storage } }">
                  {{ storage || '-' }}
                </template>

                <template #cell(gas_used)="{ item: { gas_used }}">
                  {{ gas_used || '-' }}
                </template>

                <template #cell(fees)="{ item: { fees } }">
                  {{ fees || '-' }}
                </template>

                <template #cell(validator_address)="{ item: { validator_address } }">
                  <router-link
                    :to="{ name: 'validator', params: { id: validator_address } }"
                  >
                    {{ validator_address | trimHashFromTo(6, -6) }}
                  </router-link>
                </template>
              </CommonTable>
            </b-card>

            <b-card
              v-else
              header="Account balance"
            >
              <div
                v-if="loading"
                class="text-center account__loading"
              >
                <font-awesome-icon
                  class="icon account__icon"
                  icon="spinner"
                  spin
                />
              </div>
              <LineChart
                v-else
                :chart-data="stakeChartData"
                :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
                :y-axes-begin-at-zero="false"
                :y-ticks-callback="chartsTicksCallback"
              />
            </b-card>
          </div>
        </b-col>
      </b-row>

      <b-row
        v-else
        class="account__content"
      >
        <b-col cols="12">
          <div class="text-center block__empty">
            No data
          </div>
        </b-col>
      </b-row>

      <b-row
        v-if="account && account.validator"
        class="account__validator"
      >
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
                          :to="{ name: 'account', params: { id: account.validator.node_address } }"
                        >
                          {{ account.validator.node_address }}
                        </router-link>
                      </p>
                    </div>
                    <div class="account__item">
                      Consensus address:
                      <p class="account__value">
                        {{ account.validator.consensus_address }}
                      </p>
                    </div>
                    <div class="account__item">
                      Delegators count:
                      <p class="account__value">
                        {{ account.validator.depositors_count }}
                      </p>
                    </div>
                    <div class="account__item">
                      Blocks count:
                      <p class="account__value">
                        {{ account.validator.blocks_count }}
                      </p>
                    </div>
                    <div class="account__item">
                      Signatures count:
                      <p class="account__value">
                        {{ account.validator.signatures_count }}
                      </p>
                    </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="account__container">
                    <div class="account__item">
                      Rate change interval:
                      <p class="account__value">
                        {{ account.validator.rate_change_interval }}
                      </p>
                    </div>
                    <div class="account__item">
                      Rate bound lead:
                      <p class="account__value">
                        {{ account.validator.rate_bound_lead }}
                      </p>
                    </div>
                    <div class="account__item">
                      Max rate steps:
                      <p class="account__value">
                        {{ account.validator.max_rate_steps }}
                      </p>
                    </div>
                    <div class="account__item">
                      Max bound steps:
                      <p class="account__value">
                        {{ account.validator.max_bound_steps }}
                      </p>
                    </div>
                    <div class="account__item">
                      Status:
                      <p class="account__value">
                        {{ account.validator.status }}
                      </p>
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
/* eslint-disable camelcase */
import { state } from '@/store';
import dayjs from 'dayjs';
import numeral from 'numeral';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';
import LineChart from '@/components/charts/LineChart.vue';
import CommonTable from '@/components/CommonTable/CommonTable.vue';

const tabs = [
  { key: 'transfers', label: 'Transfers' },
  { key: 'addescrow/reclaimescrow', label: 'Escrow events' },
  { key: 'other', label: 'Other ops' },
  { key: 'rewards', label: 'Rewards' },
  { key: 'charts', label: 'Charts' },
];

export default {
  name: 'Account',
  components: {
    Breadcrumbs,
    LineChart,
    CommonTable,
  },
  mixins: [
    copyToClipboard,
    getDatesInSeconds,
  ],
  data() {
    return {
      account: null,
      loading: false,
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
      rewardsFields: [
        { key: 'total_reward', label: 'Total rewards' },
        { key: 'day_reward', label: 'Daily rewards' },
        { key: 'week_reward', label: 'Weekly rewards' },
        { key: 'month_reward', label: 'Monthly rewards' },
      ],
      activeTab: tabs[0],
      tabs,
      requestName: 'getTransactions',
      charts: {
        stake: null,
      },
      xAxesMaxTicksLimit: 10,
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
  computed: {
    stakeChartData() {
      return {
        datasets: [
          {
            label: 'Total balance',
            data: this.charts.stake.map(({
              general_balance,
              escrow_balance,
              self_stake_balance,
              debonding_balance,
            }) => (
              general_balance + escrow_balance + self_stake_balance + debonding_balance
            )),
            borderWidth: 1,
            backgroundColor: this.palette[0],
          },
          {
            label: 'Escrow balance',
            data: this.charts.stake.map(({ escrow_balance }) => escrow_balance),
            borderWidth: 1,
            backgroundColor: this.palette[1],
          },
          {
            label: 'Debonding balance',
            data: this.charts.stake.map(
              ({ debonding_balance }) => debonding_balance,
            ),
            borderWidth: 1,
            backgroundColor: this.palette[2],
          },
          {
            label: 'Self stake balance',
            data: this.charts.stake.map(
              ({ self_stake_balance }) => self_stake_balance,
            ),
            borderWidth: 1,
            backgroundColor: this.palette[3],
          },
          {
            label: 'Delegations balance',
            data: this.charts.stake.map(
              ({ delegations_balance }) => delegations_balance,
            ),
            borderWidth: 1,
            backgroundColor: this.palette[4],
          },
          {
            label: 'Debonding delegations balance',
            data: this.charts.stake.map(
              ({ debonding_delegations_balance }) => debonding_delegations_balance,
            ),
            borderWidth: 1,
            backgroundColor: this.palette[5],
          },
        ],
        labels: this.charts.stake.map(
          state.dateFormat === this.$constants.DATE_FORMAT
            ? ({ timestamp }) => dayjs.unix(timestamp).format('DD.MM.YYYY')
            : ({ timestamp }) => dayjs.unix(timestamp).format('MM.DD.YYYY'),
        ),
      };
    },
    fetchParams() {
      const fetchParams = {
        account_id: this.$route.params.id,
      };

      switch (this.activeTab.key) {
        case 'addescrow/reclaimescrow':
          fetchParams.operation_kind = [
            'addescrow',
            'reclaimescrow',
          ];
          break;
        case 'other':
          fetchParams.operation_kind = [
            'registernode',
            'registerentity',
            'amendcommissionschedule',
            'registerruntime',
          ];
          break;
        case 'rewards':
          return {
            id: fetchParams.account_id,
          };
        case 'transfers':
        default:
          fetchParams.operation_kind = 'transfer';
      }

      return fetchParams;
    },
    fields() {
      switch (this.activeTab.key) {
        case 'addescrow/reclaimescrow':
          return [
            { key: 'level', label: 'Height' },
            { key: 'hash', label: 'Operation hash' },
            { key: 'type', label: 'Type' },
            { key: 'escrow_amount', label: 'Escrow amount' },
            { key: 'timestamp', label: 'Date' },
          ];
        case 'other':
          return [
            { key: 'level', label: 'Height' },
            { key: 'hash', label: 'Operation hash' },
            { key: 'type', label: 'Type' },
            { key: 'escrow_amount', label: 'Escrow amount' },
            { key: 'timestamp', label: 'Date' },
          ];
        case 'rewards':
          return [
            { key: 'block_level', label: 'Height' },
            { key: 'validator_address', label: 'Validator address' },
            { key: 'epoch', label: 'Epoch' },
            { key: 'amount', label: 'Amount' },
            { key: 'created_at', label: 'Date' },
          ];
        case 'transfers':
        default:
          return [
            { key: 'level', label: 'Height' },
            { key: 'hash', label: 'Transaction hash' },
            { key: 'from', label: 'From' },
            { key: 'to', label: 'To' },
            { key: 'amount', label: 'Amount' },
            { key: 'timestamp', label: 'Date' },
          ];
      }
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        this.fetch('account');
      },
    },
    activeTab({ key }) {
      switch (key) {
        case 'charts':
          this.fetch('chart-stake');
          break;
        case 'rewards':
          this.requestName = 'getAccountRewards';
          break;
        default:
          this.requestName = 'getTransactions';
      }
      // if (key === 'charts') {
      //   this.fetch('chart-stake');
      // }
    },
  },
  methods: {
    onClickTab(tab) {
      this.activeTab = tab;
    },
    chartsTicksCallback(label) {
      if (label > 1) {
        return numeral(label / 1000000000).format('0,0.[000000000]');
      }

      return label.toFixed();
    },
    async fetch(dataType) {
      this.loading = true;

      switch (dataType) {
        case 'account':
          await this.fetchAccount();
          break;
        case 'chart-stake':
          await this.fetchChartStake();
          break;
        default:
      }

      this.loading = false;
    },
    async fetchAccount() {
      this.account = null;

      try {
        const response = await this.$api.getAccount({
          id: this.$route.params.id,
        });

        if (response.status !== 200) {
          throw new Error(response);
        }

        const unixEpoch = '1970-01-01T00:00:00Z';
        const mainnetStart = '2020-11-18T16:01:00Z';
        const { created_at, last_active } = response.data;

        if (created_at === unixEpoch && last_active === unixEpoch) {
          response.data.created_at = mainnetStart;
          response.data.last_active = mainnetStart;
        }

        this.account = response.data;
      } catch (e) {
        this.$router.push({ name: '404' });
        //* eslint-disable no-console */
        console.error(e);
      }
    },
    async fetchChartStake() {
      const response = await this.$api.getChartStake({
        limit: 10,
        from: this.datesInSeconds.monthAgo,
        to: this.datesInSeconds.today,
        frame: 'D',
        id: this.$route.params.id,
      });

      this.charts.stake = response.data;
    },
  },
};
</script>

<style lang="scss">
  .account {
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
  }
</style>

<style lang="scss">
  .account {
    &__breadcrumbs {
      margin-bottom: 35px;
    }

    &__cards-wrapper {
      display: flex;
      flex-direction: column;
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
      width: calc(100% / 5);
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
