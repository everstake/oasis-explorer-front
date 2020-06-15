<template>
  <div class="validators-list">
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
      <template #cell(#)="data">{{ data.index + 1 }}</template>
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
  name: 'ValidatorsList',
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
          { key: 'address', label: 'Address' },
          { key: 'staking_balance', label: 'Stacking balance', sortable: true },
          { key: 'availability_score', label: 'Availability score', sortable: true },
          { key: 'fee', label: 'Fee', sortable: true },
          { key: 'num_of_voters', label: '# Voters' },
          { key: 'proposals', label: 'Block proposals', sortable: true },
          { key: 'signatures', label: 'Block signatures', sortable: true },
          { key: 'validating_since', label: 'Validating since' },
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
    fetchData(params = {}) {
      return this.$api.getValidators({ ...params, limit: this.getValidatorsLimit });
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
    getValidatorsLimit() {
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
  .validators-list {
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
