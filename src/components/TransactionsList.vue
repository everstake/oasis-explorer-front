<template>
  <div class="transactions-list">
    <b-table
      ref="table"
      :busy="loading && data === null"
      :responsive="true"
      show-empty
      :fields="fields"
      :items="data"
      class="table table--border"
      borderless
      no-border-collapse
      @row-selected="handleRowClick"
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(level)="data">
        <router-link
          :to="{ name: 'transaction', params: { id: data.item.level } }"
        >
          {{ data.item.level }}
        </router-link>
      </template>
      <template #cell(hash)="data">
        <router-link
          :to="{ name: 'transaction', params: { id: data.item.hash } }"
        >
          {{ data.item.hash }}
        </router-link>
      </template>
      <template #cell(from)="items">
        <span v-if="!items.item.from">-</span>
        <router-link
          v-else
          :to="{ name: 'account', params: { id: items.item.from } }"
        >
          {{ items.item.from }}
        </router-link>
      </template>
      <template #cell(to)="data">
        {{ data.item.to === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
        ? 'System Account' : !data.item.to ? '-' : data.item.to }}
      </template>
      <template #cell(fees)="data">
        {{ !data.item.fees ? '-' : data.item.fees }}
      </template>
      <template #cell(amount)="data">
        {{ !data.item.amount ? '-' : data.item.amount }}
      </template>
      <template #cell(timestamp)="items">
        {{ items.item.timestamp | formatDate }}
        <div class="date-from-now">
          {{ items.item.timestamp | formatDaysAgo }}
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
  name: 'TransactionsList',
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
          { key: 'level', label: 'Height', sortable: true },
          { key: 'hash', label: 'Block Hash' },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount', sortable: true },
          { key: 'nonce', label: 'Nonce' },
          { key: 'type', label: 'Type' },
          { key: 'timestamp', label: 'Date', sortable: true },
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
        name: 'transaction',
        params: { hash },
      });
    },
    fetchData(params = {}) {
      return this.$api.getTransactions({ ...params, limit: this.getTransactionsLimit });
    },
    async onShowMore() {
      this.loading = true;
      this.offset += 50;
      const data = await this.fetchData({ offset: this.offset });

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
  .transactions-list {
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
