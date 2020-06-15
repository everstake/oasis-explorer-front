<template>
  <div class="accounts-list">
    <b-table
      ref="table"
      :busy="loading && data === null"
      :responsive="true"
      show-empty
      :fields="fields"
      :items="data"
      class="table table--border table-list"
      borderless
      no-border-collapse
      @row-selected="handleRowClick"
      @sort-changed="handleSortChange"
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(#)="data">{{ data.index + 1 }}</template>
      <template #cell(delegate)="data">
        <router-link
          v-if="data.item.delegate"
          :to="{ name: 'account', params: { id: data.item.delegate } }"
          class="table__hash"
        >
          {{ data.item.delegate }}
        </router-link>
        <span v-else>-</span>
      </template>
      <template #cell(general_balance)="data">
        {{ data.item.general_balance | formatAmount }}
      </template>
      <template #cell(escrow_balance)="data">
        {{ data.item.escrow_balance | formatAmount }}
      </template>
      <template #cell(escrow_balance_share)="data">
        {{ data.item.escrow_balance_share | formatAmount }}
      </template>
      <template #cell(operations_amount)="data">
        {{ data.item.operations_amount | formatAmount }}
      </template>
      <template #cell(account_id)="data">
        <router-link
          v-if="data.item.account_id"
          :to="{ name: 'account', params: { id: data.item.account_id } }"
          class="table__hash"
        >
          {{ data.item.account_id }}
        </router-link>
        <span v-else>-</span>
      </template>
      <template #cell(created_at)="data">
        {{ data.item.created_at | formatDate }}
        <div class="date-from-now">
          {{ data.item.created_at | formatDaysAgo }}
        </div>
      </template>
    </b-table>
    <div
      v-if="scrollToLoadMore && data !== null"
      class="blocks-list__actions"
    >
      <b-button
        @click="onShowMore"
        variant="outline-primary"
        class="blocks-list__button font-weight-bold"
        :class="{
          'blocks-list__button--loading': loading
        }"
        :disabled="loading"
      >
        <span v-if="error">
          Something went wrong, click to retry
        </span>
        <span v-else-if="loading" disabled>
          Loading
          <font-awesome-icon class="blocks-list__icon" icon="sync-alt" :spin="loading" />
        </span>
        <span v-else>
          Show more
          <font-awesome-icon class="blocks-list__icon" icon="arrow-circle-down" :spin="loading" />
        </span>
      </b-button>
    </div>
  </div>
</template>

<script>
import TableLoader from '@/components/TableLoader.vue';
import debounce from 'lodash/debounce';

export default {
  name: 'AccountsList',
  components: {
    TableLoader,
  },
  props: {
    rows: {
      type: Number,
      default: null,
    },
    scrollToLoadMore: {
      type: Boolean,
      default: true,
    },
    fields: {
      type: Array,
      default() {
        return [
          { key: '#', label: '#' },
          { key: 'account_id', label: 'Account' },
          { key: 'delegate', label: 'Delegate' },
          { key: 'general_balance', label: 'General balance', sortable: true },
          { key: 'escrow_balance', label: 'Escrow balance', sortable: true },
          { key: 'escrow_balance_share', label: 'Escrow share', sortable: true },
          { key: 'operations_amount', label: 'Ops amount', sortable: true },
          { key: 'type', label: 'Type' },
          { key: 'created_at', label: 'Created at', sortable: true },
        ];
      },
    },
  },
  data() {
    return {
      data: null,
      loading: null,
      limit: 50,
      offset: 0,
      error: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    handleScroll() {
      if (window.scrollY > this.$refs.table.$el.getBoundingClientRect().height) {
        this.onShowMore();
      }
    },
    handleRowClick(item) {
      const { hash } = item[0];

      this.$router.push({
        name: 'account',
        params: { hash },
      });
    },
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
        this.data = [
          ...this.data,
          ...data.data,
        ];
      }

      this.loading = false;
    },
    fetchData(params = {}) {
      return this.$api.getAccounts({
        ...params,
        limit: this.getTransactionsLimit,
        offset: this.offset,
      });
    },
    async onShowMore() {
      this.loading = true;
      this.offset += 50;
      const data = await this.fetchData();

      if (data.status !== 200) {
        this.error = true;
      } else {
        this.error = false;
        this.data = [
          ...this.data,
          ...data.data,
        ];
      }

      this.loading = false;
    },
    setEventListenerOnScroll() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 100);
      window.addEventListener('scroll', this.handleDebouncedScroll);
    },
    removeEventListenerOnScroll() {
      window.removeEventListener('scroll', this.handleDebouncedScroll);
    },
  },
  computed: {
    getTransactionsLimit() {
      return this.rows || this.limit;
    },
  },
  async created() {
    this.loading = true;
    const data = await this.fetchData();
    this.data = data.data;
    this.loading = false;

    if (this.scrollToLoadMore) {
      this.setEventListenerOnScroll();
    }
  },
  beforeDestroy() {
    if (this.scrollToLoadMore) {
      this.removeEventListenerOnScroll();
    }
  },
};
</script>

<style lang="scss">
  .accounts-list {
    &__actions {
      margin-top: 50px;
      margin-bottom: 50px;
    }

    &__button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: auto;

      &:hover,
      &:active {
        color: $color-white !important;
      }

      &--loading {
        color: $color-primary;
        background: $color-white;
        box-shadow: none;
        border: 1px solid transparent;

        &:hover,
        &:focus {
          color: $color-primary !important;
          background: $color-white;
          outline: none;
          box-shadow: none;
        }
      }
    }

    &__icon {
      margin-left: 10px;
    }

    & .date-from-now {
      font-size: 14px;
      color: #999;
    }
  }
</style>
