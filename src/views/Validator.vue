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
      <b-row v-else>
        <b-col cols="3">
          <div class="validator__section transaction__section">
            <b-card
              class="validator__info"
              header="Operation information"
            >
              <b-card-text
                v-if="items[0].account_name"
                class="block__content"
              >
                <div class="block__header">Name</div>
                {{ items[0].account_name }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Address</div>
                <div
                  @click="copyToClipboard(items[0].account_id)"
                  class="block__copy"
                >
                  <span
                    :ref="items[0].account_id"
                  >
                    {{ items[0].account_id }}
                  </span>
                  <font-awesome-icon
                    :icon="['fas', 'copy']"
                    :class="{
                      'icon--success': isHashCopied
                    }"
                    class="icon icon-copy delegator-card__icon"
                  />
                </div>
              </b-card-text>
              <b-card-text v-if="items[0].escrow_balance" class="block__content">
                <div class="block__header">Escrow balance</div>
                {{ items[0].escrow_balance | formatAmount }}
              </b-card-text>
              <b-card-text v-if="items[0].signatures_count" class="block__content">
                <div class="block__header">Signatures</div>
                {{ items[0].signatures_count }}
              </b-card-text>
              <b-card-text v-if="items[0].blocks_count" class="block__content">
                <div class="block__header">Proposals (blocks_count)</div>
                {{ items[0].blocks_count }}
              </b-card-text>
              <b-card-text class="block__content">
                <div
                  v-if="items[0].depositors_count"
                  class="block__header"
                >
                  Depositors (depositors_count)
                </div>
                {{ items[0].depositors_count }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header" v-if="items[0].available_score">Available score</div>
                {{ items[0].available_score | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Fee</div>
                {{ items[0].fee }}
              </b-card-text>
              <b-card-text class="block__content">
                  <div
                    v-if="items[0].status"
                    :class="{
                      'validator__status--active': items[0].status === 'active',
                      'validator__status--inactive': items[0].status === 'inactive'
                    }"
                  >
                    <div class="block__header">Status</div>
                    <font-awesome-icon
                      v-if="items[0].status === 'active'"
                      icon="check-circle"
                    />
                    <font-awesome-icon
                      v-else-if="items[0].status === 'inactive'"
                      icon="times-circle"
                    />
                  </div>
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header" v-if="items[0].validate_since">Validate since</div>
                {{ items[0].validate_since | formatDate }}
                <div class="date-from-now">
                  ({{ items[0].validate_since | formatDaysAgo }})
                </div>
              </b-card-text>
            </b-card>
          </div>
        </b-col>
        <b-col cols="9">
          <div class="block__section">
            <div class="block__section block__section--table">
              <b-card class="validator__card">
                <div class="validator__actions">
                  <b-btn
                    class="validator__btn"
                    :class="{
                      'validator__btn--active': activeTab === 'transfers'
                    }"
                    @click="handleTableUpdate('transfers')"
                  >
                    Transfers
                  </b-btn>
                  <b-btn
                    class="validator__btn"
                    :class="{
                      'validator__btn--active': activeTab === 'addescrow/reclaimescrow'
                    }"
                    @click="handleTableUpdate('addescrow/reclaimescrow')"
                  >
                    Escrow events
                  </b-btn>
                  <b-btn
                    class="validator__btn"
                    :class="{
                      'validator__btn--active': activeTab === 'other'
                    }"
                    @click="handleTableUpdate('other')"
                  >
                    Other ops
                  </b-btn>
                  <b-btn
                    class="validator__btn"
                    :class="{
                      'validator__btn--active': activeTab === 'delegators'
                    }"
                    @click="handleTableUpdate('delegators')"
                  >
                    Delegators
                  </b-btn>
                  <b-btn
                    class="validator__btn"
                    :class="{
                      'validator__btn--active': activeTab === 'performance'
                    }"
                    @click="handleTableUpdate('performance')"
                  >
                    Validator performance
                  </b-btn>
                  <b-btn
                    class="validator__btn"
                    :class="{
                      'validator__btn--active': activeTab === 'charts'
                    }"
                    @click="handleTableUpdate('charts')"
                  >
                    Charts
                  </b-btn>
                </div>
                <div class="validator__shadow">
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
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="tableItems.length"
                    :per-page="perPage"
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </b-card>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import TableLoader from '@/components/TableLoader.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
/* eslint-disable */

export default {
  name: 'Validator',
  components: {
    Breadcrumbs,
    TableLoader,
  },
  mixins: [
    copyToClipboard,
  ],
  data() {
    return {
      loading: null,
      limit: 50,
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
      perPage: 5,
      transfers: null,
      otherOps: null,
      activeTab: 'transfers',
      tableItems: [],
      charts: {
        uptime: null,
        stake: null,
      },
    };
  },
  methods: {
    setActiveTab(label) {
      this.activeTab = label;
    },
    handleTableUpdate(type) {
      switch (type) {
        case 'transfers':
          this.getValidatorTransfers();
          this.setActiveTab('transfers');
          break;
        case 'delegators':
          this.getValidatorDelegators();
          this.setActiveTab('delegators');
          break;
        case 'addescrow/reclaimescrow':
          this.getValidatorEscrowEvents();
          this.setActiveTab('addescrow/reclaimescrow');
          break;
        case 'performance':
          this.getValidatorUptime();
          this.setActiveTab('performance');
          break;
        case 'charts':
          this.getValidatorCharts();
          this.setActiveTab('charts');
          break;
        case 'other':
          this.getValidatorOtherOps();
          this.setActiveTab('other');
          break;
        default:
          this.getValidatorTransfers();
          this.setActiveTab('transfers');
      }
    },
    async getValidatorTransfers() {
      this.loading = true;
      const transfers = await this.$api.getTransactions({
        limit: 15,
        sender: this.$route.params.id,
        receiver: this.$route.params.id,
      });

      this.tableItems = transfers.data;
      this.loading = false;
    },
    async getValidatorEscrowEvents() {
      this.loading = true;
      const transfers = await this.$api.getTransactions({
        limit: 15,
        operation_kind: ['addescrow', 'reclaimescrow'],
      });

      this.tableItems = transfers.data;
      this.loading = false;
    },
    async getValidatorOtherOps() {
      this.loading = true;
      const otherOps = await this.$api.getTransactions({
        limit: 15,
        operation_kind: ['registernode', 'registerentity', 'amendcommissionschedule', 'registerruntime'],
      });

      this.tableItems = otherOps.data;
      this.loading = false;
    },
    async getValidatorDelegators() {
      this.loading = true;
      const delegators = await this.$api.getValidatorDelegators({
        limit: 15,
        id: this.$route.params.id,
      });

      this.tableItems = delegators.data;
      this.loading = false;
    },
    getValidatorCharts() {
      this.getValidatorUptime();
      this.getValidatorStake();
    },
    async getValidatorUptime() {
      this.loading = true;
      const todayMs = new Date().getTime();
      const thirtyDaysMs = new Date(new Date().setDate(new Date().getDate() - 30)).getTime();

      const todaySec = Math.round(todayMs / 1000);
      const thirtyDaysSec = Math.round(thirtyDaysMs / 1000);

      const uptime = await this.$api.getValidatorUptime({
        limit: 15,
        from: thirtyDaysSec,
        to: todaySec,
        frame: 'D',
        id: this.$route.params.id,
      });

      this.charts.uptime = uptime.data;
      this.loading = false;
    },
    async getValidatorStake() {
      this.loading = true;
      const todayMs = new Date().getTime();
      const thirtyDaysMs = new Date(new Date().setDate(new Date().getDate() - 30)).getTime();

      const todaySec = Math.round(todayMs / 1000);
      const thirtyDaysSec = Math.round(thirtyDaysMs / 1000);

      const stake = await this.$api.getValidatorStake({
        limit: 15,
        from: thirtyDaysSec,
        to: todaySec,
        frame: 'D',
        id: this.$route.params.id,
      });

      this.charts.stake = stake.data;
      this.loading = false;
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
          { key: 'amount', label: 'Amount' },
          { key: 'timestamp', label: 'Date' },
        ];
      }

      if (this.activeTab === 'addescrow/reclaimescrow') {
        return [
          { key: 'level', label: 'Height' },
          { key: 'hash', label: 'Operation hash' },
          { key: 'type', label: 'Type' },
          { key: 'amount', label: 'Amount' },
          { key: 'timestamp', label: 'Date' },
        ];
        return;
      }
      
      return [];
    },
  },
  async created() {
    this.loading = true;

    const data = await this.$api.getValidator({
      limit: 15,
      id: this.$route.params.id,
    });

    if (data.status !== 200) {
      this.$router.push({ name: '404' });
    }
    this.items = data.data;

    this.getValidatorTransfers();

    this.loading = false;
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

    & .card-body {
      flex-grow: 0;
    }
  }

  &__shadow {
    height: 100%;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  }

  &__actions {
    margin-bottom: 15px;
  }

  &__btn {
    margin-right: 15px;
    background-color: #4cd4a9 !important;
    border-color: #4cd4a9 !important;

    &--active {
      box-shadow: 0 0 0 0.2rem rgba(76, 212, 169, .5) !important;
    }

    &:focus,
    &:active,
    &:hover,
    &:active:focus {
      box-shadow: 0 0 0 0.2rem rgba(76, 212, 169, .5) !important;
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
}
</style>
