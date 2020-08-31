<template>
  <div class="blocks-list">
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
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(level)="items">
        <router-link :to="{ name: 'block', params: { id: items.item.level } }">
          {{ items.item.level }}
        </router-link>
      </template>
      <template #cell(hash)="items">
        <router-link
          :to="{ name: 'block', params: { id: items.item.hash } }"
          :class="{
            table__hash: minifyTableHash,
          }"
        >
          {{ items.item.hash }}
        </router-link>
      </template>
      <template #cell(fees)="items">
        {{ !items.item.fees ? '-' : items.item.fees }}
      </template>
      <template #cell(timestamp)="items">
        {{ items.item.timestamp | formatDate }}
        <div class="date-from-now">
          {{ items.item.timestamp | formatDaysAgo }}
        </div>
      </template>
      <template #cell(number_of_txs)="items">
        <div class="text-center table__hash">
          {{ items.item.number_of_txs ? items.item.number_of_txs : '-' }}
        </div>
      </template>
      <template #cell(number_of_signatures)="items">
        {{
          items.item.number_of_signatures
            ? items.item.number_of_signatures
            : '-'
        }}
      </template>
    </b-table>
    <div
      v-if="fetchOnScrollEnabled && items !== null"
      class="blocks-list__actions"
    >
      <b-button
        @click="handleShowMore"
        variant="outline-primary"
        class="blocks-list__button font-weight-bold"
        :class="{
          'transactions-list__button--loading': loading,
        }"
        :disabled="loading || isShowMoreButtonDisabled"
      >
        <span v-if="error">
          Something went wrong, click to retry
        </span>
        <span v-else-if="loading" disabled>
          Loading
          <font-awesome-icon
            class="blocks-list__icon"
            icon="sync-alt"
            :spin="loading"
          />
        </span>
        <span v-else>
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
</template>

<script>
import TableLoader from '@/components/TableLoader.vue';
import fetchList from '@/mixins/fetchList';
import fetchOnScroll from '@/mixins/fetchOnScroll';

// eslint-disable-next-line no-unused-expressions
import(/* webpackPreload: true */ '@/assets/styles/blocksList.scss');

export default {
  name: 'BlocksList',
  components: {
    TableLoader,
  },
  mixins: [fetchList, fetchOnScroll],
  props: {
    minifyTableHash: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: () => [
        { key: 'level', label: 'Height', sortable: true },
        { key: 'hash', label: 'Block hash' },
        { key: 'proposer', label: 'Proposer' },
        { key: 'number_of_signatures', label: 'Signatures' },
        { key: 'number_of_txs', label: '# of Ops', sortable: true },
        { key: 'epoch', label: 'Epoch' },
        { key: 'fees', label: 'Fees' },
        { key: 'timestamp', label: 'Date', sortable: true },
      ],
    },
  },
  methods: {
    fetchData(params = {}) {
      return this.$api.getBlocks({ ...params, limit: this.getRequestLimit });
    },
  },
  created() {
    this.fetchList('getBlocks', { limit: this.getRequestLimit });
  },
};
</script>
