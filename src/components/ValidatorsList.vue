<template>
  <CommonTable
    class="validators-list"
    request-name="getValidators"
    :fields="fields"
  >
    <template #cell(number)="{ index }">
      {{ index + 1 }}
    </template>

    <template #cell(account_id)="{ item: { account_id, media_info, account_name } }">
      <router-link
        :to="{ name: 'validator', params: { id: account_id } }"
      >
        <span v-if="media_info && media_info.logotype">
          <ValidatorLogotype
            :src="media_info.logotype"
            :account-name="account_name"
            class="validators-list__logo"
          />
        </span>

        <img
          v-else
          class="validators-list__logo"
          src="../assets/images/logo-oasis.svg"
          alt="Oasis logotype"
        >

        <span v-if="account_name">
          {{ account_name }}
        </span>

        <span v-else-if="account_id">
          {{ account_id | trimHash }}
        </span>
      </router-link>
    </template>

    <template #cell(escrow_balance)="{ item: { escrow_balance } }">
      {{ escrow_balance | formatAmount }}
    </template>

    <template #cell(day_uptime)="{ item: { day_uptime, total_uptime }}">
      {{ String(day_uptime * 100).slice(0, 4) }}% /
      {{ String(total_uptime * 100).slice(0, 4) }}%
    </template>

    <template #cell(status)="{ item: { status } }">
      <StatusIcon
        :status="status === 'active'"
      />
    </template>

    <template #cell(node_address)="{ item: { node_address }}">
      <router-link
        :to="{ name: 'account', params: { id: node_address } }"
      >
        {{ node_address }}
      </router-link>
    </template>

    <template #cell(fee)="{ item: { fee }}">
      {{ fee }}%
    </template>

    <template #cell(validate_since)="{ item: { validate_since } }">
      {{ validate_since | formatYear }}

      <div class="common-table__format-days-ago">
        {{ validate_since | formatDaysAgo }}
      </div>
    </template>
  </CommonTable>
</template>

<script>
import ValidatorLogotype from '@/components/ValidatorLogotype.vue';
import CommonTable from '@/components/CommonTable/CommonTable.vue';
import StatusIcon from '@/components/StatusIcon.vue';

export default {
  name: 'ValidatorsList',
  components: {
    CommonTable,
    ValidatorLogotype,
    StatusIcon,
  },
  data() {
    return {
      fields: [
        { key: 'number', label: '#' },
        {
          key: 'account_id',
          label: 'Account',
          class: 'cell-xxl',
        },
        {
          key: 'escrow_balance',
          label: 'Escrow balance',
          sortable: true,
          class: 'cell-xxl',
        },
        { key: 'day_uptime', label: 'Uptime day/total', class: 'cell-xl-center' },
        { key: 'depositors_count', label: 'Delegators' },
        { key: 'blocks_count', label: 'Proposals', sortable: true },
        { key: 'signatures_count', label: 'Signatures', sortable: true },
        { key: 'fee', label: 'Fee', sortable: true },
        { key: 'status', label: 'Status', class: 'cell-center' },
        { key: 'validate_since', label: 'Registered', sortable: true },
      ],
    };
  },
};
</script>

<style lang="scss">
.validators-list {
  box-shadow: $box-shadow-table;
  margin-bottom: 16px;

  &__logo {
    display: inline-block;
    max-height: 30px;
    max-width: 30px;
    margin-right: 5px;
    border-radius: 4px;
  }
}
</style>
