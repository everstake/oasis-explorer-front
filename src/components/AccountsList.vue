<template>
  <CommonTable
    class="accounts-list"
    request-name="getAccounts"
    :fields="fields"
    is-sort-via-api-enabled
  >
    <template #cell(number)="{ index }">
      {{ index + 1 }}
    </template>

    <template #cell(account_id)="{ item: { account_id } }">
      <router-link
        v-if="account_id"
        :to="{ name: 'account', params: { id: account_id } }"
      >
        {{ account_id | trimHash }}
      </router-link>

      <span v-else>-</span>
    </template>

    <template #cell(delegate)="{ item: { delegate } }">
      <router-link
        v-if="delegate"
        :to="{ name: 'account', params: { id: delegate } }"
      >
        {{ delegate | trimHash }}
      </router-link>

      <span v-else>-</span>
    </template>

    <template #cell(general_balance)="{ item: { general_balance } }">
      {{ general_balance | formatAmount }}
    </template>

    <template #cell(escrow_balance)="{ item: { escrow_balance } }">
      {{ escrow_balance | formatAmount }}
    </template>

    <template #cell(escrow_balance_share)="{ item: { escrow_balance_share } }">
      {{ escrow_balance_share | formatAmount }}
    </template>

    <template #cell(delegations_balance)="{ item: { delegations_balance } }">
      {{ delegations_balance | formatAmount }}
    </template>

    <template
      #cell(debonding_delegations_balance)="{ item: { debonding_delegations_balance } }"
    >
      {{ debonding_delegations_balance | formatAmount }}
    </template>

    <template #cell(created_at)="{ item: { created_at } }">
      {{ created_at | formatDate }}

      <div class="common-table__format-days-ago">
        {{ created_at | formatDaysAgo }}
      </div>
    </template>
  </CommonTable>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable.vue';

export default {
  name: 'AccountsList',
  components: {
    CommonTable,
  },
  data() {
    return {
      fields: [
        { key: 'number', label: '#' },
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
};
</script>

<style lang="scss">
.accounts-list {
  box-shadow: $box-shadow-table;
  margin-bottom: 16px;
}
</style>
