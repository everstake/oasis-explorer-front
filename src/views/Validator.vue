<template>
  <div class="validator">
    <Breadcrumbs
      class="breadcrumbs validator__breadcrumbs"
      :crumbs="breadcrumbs"
    />

    <b-container fluid="lg">
      <b-row v-if="loading && !validator">
        <b-col cols="12">
          <div class="text-center block__loading">
            <font-awesome-icon class="icon block__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>

      <b-row v-else-if="validator">
        <b-col cols="4">
            <b-card class="validator__info" header="Validator information">
              <b-card-text class="block__content block__logotype">
                <ValidatorLogotype
                  v-if="validator.media_info && validator.media_info.logotype"
                  :src="validator.media_info.logotype"
                  :accountName="validator.account_name"
                  class="block__logo"
                />
                <img
                  v-else
                  class="block__logo"
                  src="../assets/images/logo-oasis.svg"
                  alt="Oasis logotype"
                >
              </b-card-text>
              <b-card-text v-if="validator.account_name" class="block__content">
                <span class="validator__name">{{ validator.account_name }}</span>
              </b-card-text>
              <b-card-text class="block__content">
                <div v-if="validator.media_info" class="validator__contacts">
                  <a
                    :class="['validator__contact', {
                      'validator__contact--active': validator.media_info.website_link,
                    }]"
                    :href="validator.media_info.website_link || '#'"
                    target="_blank"
                  >
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fa', iconName: 'globe' }"
                    />
                  </a>
                  <a
                    class="validator__contact"
                    :class="{
                      'validator__contact--active':
                        validator.media_info.email_address,
                    }"
                    :href="validator.media_info.email_address
                      ? `mailto:${validator.media_info.email_address}`
                      : '#'
                    "
                  >
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fa', iconName: 'envelope' }"
                    />
                  </a>
                  <a
                    class="validator__contact"
                    :class="{
                      'validator__contact--active': validator.media_info.tg_chat,
                    }"
                    :href="validator.media_info.tg_chat
                      ? validator.media_info.tg_chat
                      : '#'
                    "
                    target="_blank"
                  >
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'telegram' }"
                    />
                  </a>
                  <a
                    class="validator__contact"
                    :class="{
                      'validator__contact--active': validator.media_info.twitter_acc,
                    }"
                    :href="validator.media_info.twitter_acc
                      ? validator.media_info.twitter_acc
                      : '#'
                    "
                    target="_blank"
                  >
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'twitter' }"
                    />
                  </a>
                  <a
                    class="validator__contact"
                    :class="{
                      'validator__contact--active': validator.media_info.facebook_acc,
                    }"
                    :href="validator.media_info.facebook_acc
                      ? validator.media_info.facebook_acc
                      : '#'
                    "
                    target="_blank"
                  >
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'facebook' }"
                    />
                  </a>
                  <a
                    class="validator__contact"
                    :class="{
                      'validator__contact--active': validator.media_info.medium_link,
                    }"
                    :href="validator.media_info.medium_link
                      ? validator.media_info.medium_link
                      : '#'
                    "
                    target="_blank"
                  >
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'medium' }"
                    />
                  </a>
                </div>
                <div v-else class="validator__contacts">
                  <a class="validator__contact" href="#" target="_blank">
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fa', iconName: 'globe' }"
                    />
                  </a>
                  <a class="validator__contact" href="#">
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fa', iconName: 'envelope' }"
                    />
                  </a>
                  <a class="validator__contact" href="#" target="_blank">
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'telegram' }"
                    />
                  </a>
                  <a class="validator__contact" href="#" target="_blank">
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'twitter' }"
                    />
                  </a>
                  <a class="validator__contact" href="#" target="_blank">
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'facebook' }"
                    />
                  </a>
                  <a class="validator__contact" href="#" target="_blank">
                    <font-awesome-icon
                      class="validator__icon"
                      :icon="{ prefix: 'fab', iconName: 'medium' }"
                    />
                  </a>
                </div>
                <div class="validator-note">
                  If you wish to add your validator info, contact us at inbox@everstake.one
                </div>
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Address</div>
                <div
                  @click="copyToClipboard(validator.account_id)"
                  class="block__copy"
                >
                  <span :ref="validator.account_id">
                    {{ validator.account_id }}
                  </span>
                  <font-awesome-icon
                    :icon="['fas', 'copy']"
                    :class="{
                      'icon--success': isHashCopied(validator.account_id),
                    }"
                    class="icon icon-copy delegator-card__icon"
                  />
                </div>
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Signatures / Proposals</div>
                {{ validator.signatures_count }} / {{ validator.blocks_count }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Uptime</div>
                {{ String(validator.total_uptime * 100).slice(0, 4) }}%
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Total balance</div>
                {{ validator.general_balance + (
                  validator.escrow_balance + validator.debonding_balance
                ) | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">General balance</div>
                {{ validator.general_balance | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Escrow balance</div>
                {{ validator.escrow_balance | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Escrow shares</div>
                {{ validator.escrow_shares | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Unbonding balance</div>
                {{ validator.debonding_balance | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Delegations balance</div>
                {{ validator.delegations_balance | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Debonding delegations balance</div>
                {{ validator.debonding_delegations_balance | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">
                  Delegators
                </div>
                {{ validator.depositors_count }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">
                  Status
                </div>
                <StatusIcon
                  :status="validator.status === 'active'"
                />
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header" v-if="validator.validate_since">
                  Registered
                </div>
                {{ validator.validate_since | formatDate }}
                <div class="date-from-now">
                  ({{ validator.validate_since | formatDaysAgo }})
                </div>
              </b-card-text>
            </b-card>
        </b-col>

        <b-col cols="8" md="8">
          <div class="validator__cards-wrapper">
            <b-card
              class="validator__actions validator__actions--desktop"
              no-body
            >
              <b-btn
                v-for="tab in tabs"
                :key="tab.key"
                :class="['validator__btn', {
                  'validator__btn--active': activeTab === tab,
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
                headVariant="dark"
                requestName="getValidatorRewardsStat"
                :fields="rewardsFields"
                :fetchParams="fetchParams"
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
                :requestName="requestName"
                :fetchParams="fetchParams"
                :fields="fields"
                height="min-content"
              >
                <template #cell(level)="{ item: { level } }">
                  <router-link
                    :to="{ name: 'block', params: { id: level } }"
                  >
                    {{ level }}
                  </router-link>
                </template>

                <template #cell(block_level)="{ item: { block_level }}">
                  <router-link
                    :to="{
                      name: 'block',
                      params: { id: block_level },
                    }"
                  >
                    {{ block_level }}
                  </router-link>
                </template>

                <template #cell(hash)="{ item: { hash } }">
                  <router-link
                    :to="{ name: 'operation', params: { id: hash } }"
                  >
                    {{ hash | trimHashFromTo(6, -6) }}
                  </router-link>
                </template>

                <template #cell(account_id)="{ item: { account_id, account_name } }">
                  <router-link
                    :to="{ name: 'account', params: { id: account_id } }"
                  >
                    {{ account_name || account_id | trimHashFromTo(7, -7) }}
                  </router-link>
                </template>

                <template
                  #cell(escrow_amount)="{
                    item: { escrow_amount, reclaim_escrow_amount }
                  }"
                >
                  <span v-if="escrow_amount">
                    {{ escrow_amount | formatAmount }}
                  </span>

                  <span v-else-if="reclaim_escrow_amount">
                    {{ reclaim_escrow_amount | formatAmount }}
                  </span>
                </template>

                <template #cell(delegate_since)="{ item: { delegate_since }}">
                  {{ delegate_since | formatYear }}

                  <span class="common-table__format-days-ago">
                    {{ delegate_since | formatDaysAgo }}
                  </span>
                </template>

                <template #cell(to)="{ item: { to } }">
                  <div>
                    <span v-if="to === $constants.SYSTEM_ACCOUNT_ID">
                      System Account
                    </span>

                    <router-link
                      v-else-if="to"
                      :to="{ name: 'account', params: { id: to } }"
                    >
                      {{ to | trimHashFromTo(5, -5) }}
                    </router-link>

                    <span v-else>-</span>
                  </div>
                </template>

                <template #cell(from)="{ item: { from } }">
                  <div>
                    <router-link
                      v-if="from"
                      :to="{ name: 'account', params: { id: from } }"
                    >
                      {{ from | trimHashFromTo(5, -5) }}
                    </router-link>

                    <span v-else>-</span>
                  </div>
                </template>

                <template #cell(proposer)="{ item: { proposer } }">
                  {{ proposer || '-' }}
                </template>

                <template #cell(timestamp)="{ item: { timestamp } }">
                  {{ timestamp | formatDate }}
                </template>

                <template #cell(created_at)="{ item: { created_at } }">
                  {{ created_at | formatDate }}
                </template>

                <template #cell(amount)="{ item: { amount } }">
                  {{ amount | formatAmount }}
                </template>

                <template #cell(storage)="{ item: { storage } }">
                  {{ storage || '-' }}
                </template>

                <template #cell(gas_used)="{ item: { gas_used } }">
                  {{ gas_used || '-' }}
                </template>

                <template #cell(fees)="{ item: { fees }}">
                  {{ fees || '-' }}
                </template>
              </CommonTable>
            </b-card>

            <div v-else>
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
              <div v-else>
                <b-card
                  class="validator__chart-card"
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
                <b-card
                  class="validator__chart-card"
                  header="Account balance"
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
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row v-else>
        <b-col cols="12">
          <div class="text-center transaction__empty">
            No data
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import ValidatorLogotype from '@/components/ValidatorLogotype.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';
import numeral from 'numeral';
import { state } from '@/store';
import dayjs from 'dayjs';
import LineChart from '@/components/charts/LineChart.vue';
import uuid from '@/mixins/uuid';
import StatusIcon from '@/components/StatusIcon.vue';
import CommonTable from '../components/CommonTable/CommonTable.vue';

const tabs = [
  { key: 'transfers', label: 'Transfers' },
  { key: 'addescrow/reclaimescrow', label: 'Escrow events' },
  { key: 'other', label: 'Other ops' },
  { key: 'delegators', label: 'Delegators' },
  { key: 'charts', label: 'Charts' },
  { key: 'rewards', label: 'Rewards' },
];

export default {
  name: 'Validator',
  components: {
    Breadcrumbs,
    LineChart,
    ValidatorLogotype,
    CommonTable,
    StatusIcon,
  },
  mixins: [
    copyToClipboard,
    getDatesInSeconds,
    uuid,
  ],
  data() {
    return {
      loading: true,
      validator: null,
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
      rewardsFields: [
        { key: 'total_reward', label: 'Total rewards' },
        { key: 'day_reward', label: 'Daily rewards' },
        { key: 'week_reward', label: 'Weekly rewards' },
        { key: 'month_reward', label: 'Monthly rewards' },
      ],
      tabs,
      activeTab: tabs[0],
      requestName: 'getTransactions',
      charts: {
        uptime: null,
        stake: null,
      },
      oldPalette: [
        'rgba(0, 0, 0, .4)',
        'rgba(76, 212, 169, .4)',
        'rgba(47, 72, 88, .4)',
      ],
      palette: [
        'rgba(76, 212, 169, .4)',
        'rgba(27, 184, 168, .4)',
        'rgba(0, 155, 159, .4)',
        'rgba(24, 126, 141, .4)',
        'rgba(42, 98, 117, .4)',
        'rgba(47, 72, 88, .4)',
      ],
      xAxesMaxTicksLimit: 10,
      getRewardsItems: null,
    };
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        await this.fetch('validator');
      },
    },
    activeTab({ key }) {
      switch (key) {
        case 'delegators':
          this.requestName = 'getValidatorDelegators';
          break;
        case 'rewards':
          this.requestName = 'getValidatorRewards';
          break;
        case 'charts':
          this.fetch('chart-stake');
          break;
        case 'other':
        case 'addescrow/reclaimescrow':
        case 'transfers':
        default:
          this.requestName = 'getTransactions';
      }
    },
  },
  methods: {
    onClickTab(tab) {
      this.activeTab = tab;
    },
    async fetch(dataType) {
      this.loading = true;

      try {
        switch (dataType) {
          case 'validator':
            await this.fetchValidator();
            break;
          case 'chart-stake':
            await this.fetchChartStake();
            break;
          default:
        }
      } catch (e) {
        this.$router.push({ name: '404' });
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async fetchChartStake() {
      const [uptimeChart, stakeChart] = await Promise.all([
        await this.$api.getChartUptime({
          limit: 10,
          from: this.datesInSeconds.monthAgo,
          to: this.datesInSeconds.today,
          frame: 'D',
          id: this.$route.params.id,
        }),
        await this.$api.getChartStake({
          limit: 10,
          from: this.datesInSeconds.monthAgo,
          to: this.datesInSeconds.today,
          frame: 'D',
          id: this.$route.params.id,
        }),
      ]);

      if (uptimeChart.status !== 200 || stakeChart.status !== 200) {
        throw new Error({ uptimeChart, stakeChart });
      }

      this.charts.uptime = uptimeChart.data;
      this.charts.stake = stakeChart.data;
    },
    async fetchValidator() {
      this.validator = null;

      const response = await this.$api.getValidator({
        id: this.$route.params.id,
      });

      if (response.status !== 200) {
        throw new Error(response);
      }

      this.validator = response.data;
    },
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
          return `${xLabel}: ${yLabel}%`;
        }
      }
    },
  },
  computed: {
    fetchParams() {
      const { id } = this.$route.params;

      switch (this.activeTab.key) {
        case 'addescrow/reclaimescrow':
          return {
            operation_kind: ['addescrow', 'reclaimescrow'],
            account_id: id,
          };
        case 'other':
          return {
            operation_kind: [
              'registernode',
              'registerentity',
              'amendcommissionschedule',
              'registerruntime',
            ],
            account_id: id,
          };
        case 'delegators':
          return { id };
        case 'rewards':
          return { id };
        case 'transfers':
        default:
          return {
            operation_kind: 'transfer',
            account_id: id,
          };
      }
    },
    fields() {
      switch (this.activeTab.key) {
        case 'addescrow/reclaimescrow':
          return [
            { key: 'level', label: 'Height' },
            { key: 'hash', label: 'Operation hash' },
            { key: 'type', label: 'Type' },
            { key: 'escrow_amount', label: 'Escrow amount', sortable: true },
            { key: 'timestamp', label: 'Date', sortable: true },
          ];
        case 'other':
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
        case 'delegators':
          return [
            { key: 'account_id', label: 'Account' },
            { key: 'escrow_amount', label: 'Escrow amount', sortable: true },
            { key: 'delegate_since', label: 'Delegate since', sortable: true },
          ];
        case 'rewards':
          return [
            { key: 'block_level', label: 'Height' },
            { key: 'epoch', label: 'Epoch' },
            { key: 'amount', label: 'Amount', sortable: true },
            { key: 'created_at', label: 'Date', sortable: true },
          ];
        case 'transfers':
        default:
          return [
            { key: 'level', label: 'Height' },
            { key: 'hash', label: 'Transaction hash' },
            { key: 'from', label: 'From' },
            { key: 'to', label: 'To' },
            { key: 'amount', label: 'Amount', sortable: true },
            { key: 'timestamp', label: 'Date', sortable: true },
          ];
      }
    },
    getUptimeChartData() {
      return {
        datasets: [{
          label: 'Uptime',
          data: this.charts.uptime.map(
            ({ uptime }) => (uptime * 100).toFixed(2),
          ),
          borderWidth: 1,
          backgroundColor: this.palette[0],
        }],
        labels: this.charts.uptime.map(
          state.dateFormat === this.$constants.DATE_FORMAT
            ? ({ timestamp }) => dayjs.unix(timestamp).format('DD.MM.YYYY')
            : ({ timestamp }) => dayjs.unix(timestamp).format('MM.DD.YYYY'),
        ),
      };
    },
    getStakeChartData() {
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
        labels: this.charts.stake.map(({ timestamp }) => {
          if (state.dateFormat === this.$constants.DATE_FORMAT) {
            return dayjs.unix(timestamp).format('DD.MM.YYYY');
          }

          return dayjs.unix(timestamp).format('MM.DD.YYYY');
        }),
      };
    },
  },
};
</script>

<style lang="scss">
.card:not(:last-child) {
  margin-bottom: 15px;
}

.validator {
  &__breadcrumbs {
    margin-bottom: 35px;
  }

  &__cards-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__chart-card {
    box-shadow: none;
  }

  &__container {
    max-height: 1000px;
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
    width: calc(100% / 6);
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

  &-note {
    margin-top: 5px;
    padding: 5px 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #4dd4a9;
    border-radius: 4px;
  }
}

.date-from-now {
  font-size: 14px;
  color: #999;
}
</style>

<style lang="scss">
.table__rewards th {
  background-color: #353a38 !important;
}
</style>
