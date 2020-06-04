<template>
  <div class="blocks-list">
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
      hover
      selectable
      :select-mode="'single'"
      @row-selected="handleRowClick"
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(level)="items">
        {{ items.item.level }}
      </template>
      <template #cell(fees)="items">
        {{ !items.item.fees ? '-' : items.item.fees }}
      </template>
      <template #cell(timestamp)="items">
        {{ items.item.timestamp | formatDate }}
      </template>
      <template #cell(number_of_txs)="items">
        {{ items.item.number_of_txs ? items.item.number_of_txs : '-' }}
      </template>
      <template #cell(number_of_signatures)="items">
        {{ items.item.number_of_signatures ? items.item.number_of_signatures : '-' }}
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
          'transactions-list__button--loading': loading
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
          Scroll down to show more
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
  name: 'BlocksList',
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
  },
  data() {
    return {
      data: null,
      loading: null,
      limit: 50,
      offset: 0,
      fields: [
        { key: 'timestamp', label: 'Date', sortable: true },
        { key: 'level', label: 'Block height', sortable: true },
        { key: 'proposer', label: 'Proposer' },
        { key: 'number_of_signatures', label: 'Signatures' },
        { key: 'number_of_txs', label: 'Operations', sortable: true },
        { key: 'epoch', label: 'Epoch' },
        { key: 'fees', label: 'Fees' },
      ],
      error: false,
    };
  },
  computed: {
    getTransactionsLimit() {
      return this.rows || this.limit;
    },
  },
  methods: {
    handleScroll() {
      if (window.scrollY > this.$refs.table.$el.getBoundingClientRect().height) {
        this.onShowMore();
      }
    },
    fetchData(params = {}) {
      return this.$api.getBlocks({ ...params, limit: this.getTransactionsLimit });
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
    handleRowClick(item) {
      const { level } = item[0];

      this.$router.push({
        name: 'block',
        params: { level },
      });
    },
    setEventListenerOnScroll() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 100);
      window.addEventListener('scroll', this.handleDebouncedScroll);
    },
    removeEventListenerOnScroll() {
      window.removeEventListener('scroll', this.handleDebouncedScroll);
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
  .blocks-list {
    &__actions {
      margin-top: 50px;
    }

    &__button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: auto;
      border: none;

      &:hover,
      &:active {
        color: $color-white !important;
      }

      &--loading {
        color: $color-primary;
        background: $color-white;
        border: 1px solid transparent;

        &:hover,
        &:focus {
          color: $color-primary;
          background: $color-white;
          outline: none;
          border: none;
          box-shadow: none;
        }
      }
    }

    &__icon {
      margin-left: 5px;
    }
  }
</style>
