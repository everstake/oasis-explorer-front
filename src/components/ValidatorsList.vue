<template>
  <div class="validators-list">
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
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(#)="data">{{ data.index + 1 }}</template>
      <template #cell(account_id)="data">
        <router-link
          :to="{ name: 'account', params: { id: data.item.account_id } }"
        >
          {{ data.item.account_name || data.item.account_id }}
        </router-link>
      </template>
      <template #cell(escrow_balance)="data">
        {{ data.item.escrow_balance | formatAmount }}
      </template>
      <template #cell(available_score)="data">
        {{ data.item.available_score | formatAmount }}
      </template>
      <template #cell(status)="data">
        <div
          class="validators-list__status text-center"
          :class="{
            'validators-list__status--active': data.item.status === 'active',
            'validators-list__status--inactive': data.item.status === 'inactive'
          }"
        >
          <font-awesome-icon v-if="data.item.status === 'active'" icon="check-circle" />
          <font-awesome-icon v-else-if="data.item.status === 'inactive'" icon="times-circle" />
        </div>
      </template>
      <template #cell(node_address)="data">
        <router-link
          :to="{ name: 'account', params: { id: data.item.node_address } }"
        >
          {{ data.item.node_address }}
        </router-link>
      </template>
<!--      account_id-->
<!--      escrow_balance-->
<!--      available_score-->
<!--      rate_change_interval-->
<!--      rate_bound_lead-->
<!--      max_rate_steps-->
<!--      max_bound_steps-->
<!--      status-->
<!--      node_address-->
<!--      depositors_count-->
<!--      blocks_count-->
<!--      signatures_count-->
<!--      validate_since-->
      <template #cell(validate_since)="data">
        {{ data.item.validate_since | formatYear }}
        <div class="date-from-now">
          {{ data.item.validate_since | formatDaysAgo }}
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
          // { key: '#', label: '#' },
          // { key: 'account_id', label: 'Account' },
          // { key: 'staking_balance', label: 'Stacking balance', sortable: true },
          // { key: 'availability_score', label: 'Availability score', sortable: true },
          // { key: 'fee', label: 'Fee', sortable: true },
          // { key: 'num_of_voters', label: '# Voters' },
          // { key: 'proposals', label: 'Block proposals', sortable: true },
          // { key: 'signatures', label: 'Block signatures', sortable: true },
          // { key: 'validating_since', label: 'Validating since' },
          // { key: 'created_at', label: 'Created at', sortable: true },
          { key: '#', label: '#' },
          { key: 'account_id', label: 'Account' },
          { key: 'escrow_balance', label: 'Escrow balance', sortable: true },
          { key: 'available_score', label: 'Availability', sortable: true },
          { key: 'depositors_count', label: 'Delegators' },
          { key: 'blocks_count', label: 'Proposals', sortable: true },
          { key: 'signatures_count', label: 'Signatures', sortable: true },
          { key: 'fee', label: 'Fee', sortable: true },
          { key: 'status', label: 'Status' },
          { key: 'validate_since', label: 'Registered', sortable: true },
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

    &__status {
      font-weight: 600;

      &--active {
        color: #28a745;
      }

      &--inactive {
        color: #dc3545;
      }
    }
  }
</style>
