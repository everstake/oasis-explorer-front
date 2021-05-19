<template>
  <CommonTable
    class="blocks-list"
    requestName="getBlocks"
    :fields="fields"
    :fetchParams="listFetchParams"
    :isFetchOnScrollEnabled="isFetchOnScrollEnabled"
  >
    <template #cell(level)="{ item: { level } }">
      <router-link
        :to="{ name: 'block', params: { id: level } }"
      >
        {{ level }}
      </router-link>
    </template>

    <template #cell(hash)="{ item: { hash } }">
      <router-link
        :to="{ name: 'block', params: { id: hash } }"
      >
        {{ hash | trimHash }}
      </router-link>
    </template>

    <template #cell(number_of_signatures)="{ item: { number_of_signatures } }">
      {{ number_of_signatures || '-' }}
    </template>

    <template #cell(number_of_txs)="{ item: { number_of_txs } }">
      {{ number_of_txs || '-' }}
    </template>

    <template #cell(fees)="{ item: { fees } }">
      {{ fees || '-' }}
    </template>

    <template #cell(timestamp)="{ item: { timestamp } }">
      {{ timestamp | formatDate }}

      <div class="common-table__format-days-ago">
        {{ timestamp | formatDaysAgo }}
      </div>
    </template>
  </CommonTable>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable.vue';

export default {
  name: 'BlocksList',
  components: {
    CommonTable,
  },
  props: {
    fields: {
      type: Array,
      default: () => [
        { key: 'level', label: 'Height', sortable: true },
        { key: 'hash', label: 'Block hash' },
        { key: 'proposer', label: 'Proposer' },
        { key: 'number_of_signatures', label: 'Signatures' },
        {
          key: 'number_of_txs',
          label: '# of Ops',
          sortable: true,
          class: 'cell-s-center',
        },
        { key: 'epoch', label: 'Epoch' },
        { key: 'fees', label: 'Fees' },
        { key: 'timestamp', label: 'Date', sortable: true },
      ],
    },
    listFetchParams: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isFetchOnScrollEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style lang="scss">
.blocks-list {
  height: 80vh;
  box-shadow: $box-shadow-table;
  margin-bottom: 16px;
}
</style>
