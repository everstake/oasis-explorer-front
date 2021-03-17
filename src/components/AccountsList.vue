<template>
  <div class="list accounts-list">
    <b-table
      ref="table"
      :busy="loading && items === null"
      :responsive="true"
      show-empty
      :fields="fields"
      :items="items"
      class="table table--border table-list"
      borderless
      no-border-collapse
      @sort-changed="handleSortChange"
      :no-local-sorting="true"
      :no-sort-reset="true"
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(#)="items">{{ items.index + 1 }}</template>
      <template #cell(delegate)="items">
        <router-link
          v-if="items.item.delegate"
          :to="{ name: 'account', params: { id: items.item.delegate } }"
        >
          {{ items.item.delegate | trimHash }}
        </router-link>
        <span v-else>-</span>
      </template>
      <template #cell(general_balance)="items">
        {{ items.item.general_balance | formatAmount }}
      </template>
      <template #cell(escrow_balance)="items">
        {{ items.item.escrow_balance | formatAmount }}
      </template>
      <template #cell(escrow_balance_share)="items">
        {{ items.item.escrow_balance_share | formatAmount }}
      </template>
      <template #cell(delegations_balance)="items">
        {{ items.item.delegations_balance | formatAmount }}
      </template>
      <template #cell(debonding_delegations_balance)="items">
        {{ items.item.debonding_delegations_balance | formatAmount }}
      </template>
      <template #cell(operations_number)="items">
        {{ items.item.operations_number }}
      </template>
      <template #cell(account_id)="items">
        <router-link
          v-if="items.item.account_id"
          :to="{ name: 'account', params: { id: items.item.account_id } }"
        >
          {{ items.item.account_id | trimHash }}
        </router-link>
        <span v-else>-</span>
      </template>
      <template #cell(created_at)="items">
        {{ items.item.created_at | formatDate }}
        <div class="date-from-now">
          {{ items.item.created_at | formatDaysAgo }}
        </div>
      </template>
    </b-table>
    <div v-if="fetchOnScrollEnabled && items !== null" class="list-actions">
      <b-button
        @click="handleShowMore"
        variant="outline-primary"
        class="list__button font-weight-bold"
        :class="{
          'list__button--loading': loading,
        }"
        :disabled="loading || isShowMoreButtonDisabled"
      >
        <span v-if="error">
          Something went wrong, click to retry
        </span>
        <span v-else-if="loading" disabled>
          Loading
          <font-awesome-icon
            class="list__icon"
            icon="sync-alt"
            :spin="loading"
          />
        </span>
        <span v-else ref="showMoreButton">
          Show more
          <font-awesome-icon
            class="list__icon"
            icon="arrow-circle-down"
            :spin="loading"
          />
        </span>
      </b-button>
    </div>
  </div>
</template>

<script>
import TableLoader from '@/components/TableLoader.vue';
import fetchList from '@/mixins/fetchList';
import fetchOnScroll from '@/mixins/fetchOnScroll';

export default {
  name: 'AccountsList',
  components: {
    TableLoader,
  },
  mixins: [fetchList, fetchOnScroll],
  data() {
    return {
      fields: [
        { key: '#', label: '#' },
        { key: 'account_id', label: 'Account' },
        { key: 'delegate', label: 'Delegate' },
        { key: 'general_balance', label: 'General balance', sortable: true },
        { key: 'escrow_balance', label: 'Escrow balance', sortable: true },
        { key: 'escrow_balance_share', label: 'Escrow share', sortable: true },
        { key: 'delegations_balance', label: 'Delegations balance', sortable: true },
        { key: 'debonding_delegations_balance', label: 'Debonding delegations balance', sortable: true },
        { key: 'operations_number', label: 'Ops number', sortable: true },
        { key: 'type', label: 'Type' },
        { key: 'created_at', label: 'Created at', sortable: true },
      ],
    };
  },
  methods: {
    async handleSortChange(item) {
      this.loading = true;
      const data = await this.fetchData({
        sort_column: item.sortBy,
        sort_side: item.sortDesc ? 'desc' : 'asc',
      });

      if (data.status !== 200) {
        this.error = true;
      } else {
        this.error = false;
        this.items = data.data;
      }

      this.loading = false;
    },
    fetchData(params = {}) {
      return this.$api.getAccounts({ ...params, limit: this.getRequestLimit });
    },
  },
  async created() {
    this.fetchList('getAccounts', { limit: this.getRequestLimit });
  },
};
</script>

<style lang="scss">
@import '~@/assets/styles/list.scss';
</style>
