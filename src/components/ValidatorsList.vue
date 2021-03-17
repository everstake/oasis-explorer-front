<template>
  <div class="validators-list">
    <b-table
      ref="table"
      :busy="loading && items === null"
      :responsive="true"
      show-empty
      :fields="fields"
      :items="items"
      class="table table--border table-list table__validators"
      borderless
      no-border-collapse
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(#)="items">{{ items.index + 1 }}</template>
      <template #cell(account_id)="data">
        <router-link
          :to="{ name: 'validator', params: { id: data.item.account_id } }"
        >
          <span v-if="data.item.media_info && data.item.media_info.logotype">
            <v-lazy-image
              v-if="data.item.media_info.logotype"
              :src-placeholder="require('../assets/images/logo-oasis.svg')"
              :src="getValidatorLogo(data.item)"
              :alt="`${data.item.account_name} logotype`"
              :class="{
                'block__logotype--white': filterWhiteColorLogotypes(
                  data.item.account_name,
                ),
              }"
              class="validators-list__logo"
            />
          </span>
          <img
            v-else
            class="validators-list__logo"
            src="../assets/images/logo-oasis.svg"
            alt="Oasis logotype"
          />
          <span v-if="data.item.account_name">
            {{ data.item.account_name }}
          </span>
          <span v-else-if="data.item.account_id">
            {{ data.item.account_id | trimHash }}
          </span>
        </router-link>
      </template>
      <template #cell(escrow_balance)="items">
        {{ items.item.escrow_balance | formatAmount }}
      </template>
      <template #cell(day_uptime)="items">
        {{ String(items.item.day_uptime * 100).slice(0, 4) }}% /
        {{ String(items.item.total_uptime * 100).slice(0, 4) }}%
      </template>
      <template #cell(fee)="items">
        {{ items.item.fee }}%
      </template>
      <template #cell(status)="items">
        <div
          class="validators-list__status text-center"
          :class="{
            'validators-list__status--active': items.item.status === 'active',
            'validators-list__status--inactive':
              items.item.status === 'inactive',
          }"
        >
          <font-awesome-icon
            v-if="items.item.status === 'active'"
            icon="check-circle"
          />
          <font-awesome-icon
            v-else-if="items.item.status === 'inactive'"
            icon="times-circle"
          />
        </div>
      </template>
      <template #cell(node_address)="items">
        <router-link
          :to="{ name: 'account', params: { id: items.item.node_address } }"
        >
          {{ items.item.node_address }}
        </router-link>
      </template>
      <template #cell(delegations_balance)="items">
        {{ items.item.delegations_balance | formatAmount }}
      </template>
      <template #cell(debonding_delegations_balance)="items">
        {{ items.item.debonding_delegations_balance | formatAmount }}
      </template>
      <template #cell(validate_since)="items">
        {{ items.item.validate_since | formatYear }}
        <div class="date-from-now">
          {{ items.item.validate_since | formatDaysAgo }}
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
import everstakeIcon from '@/assets/images/icon-everstake.png';
import VLazyImage from 'v-lazy-image';

const oasisLogo = require('../assets/images/logo-oasis.svg');

export default {
  name: 'ValidatorsList',
  components: {
    TableLoader,
    VLazyImage,
  },
  mixins: [fetchList, fetchOnScroll],
  props: {
    fetchOnScrollEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fields: [
        { key: '#', label: '#' },
        { key: 'account_id', label: 'Account' },
        { key: 'escrow_balance', label: 'Escrow balance', sortable: true },
        {
          key: 'day_uptime',
          label: 'Uptime day/total',
          thClass: 'table__uptime',
        },
        { key: 'depositors_count', label: 'Delegators' },
        { key: 'blocks_count', label: 'Proposals', sortable: true },
        { key: 'signatures_count', label: 'Signatures', sortable: true },
        { key: 'fee', label: 'Fee', sortable: true },
        { key: 'delegations_balance', label: 'Delegations balance', sortable: true },
        { key: 'debonding_delegations_balance', label: 'Debonding delegations balance', sortable: true },
        {
          key: 'status',
          label: 'Status',
          thClass: 'table__status',
          tdClass: 'table__status',
        },
        { key: 'validate_since', label: 'Registered', sortable: true },
      ],
    };
  },
  methods: {
    fetchData(params = {}) {
      return this.$api.getValidators({
        ...params,
        limit: this.getRequestLimit,
      });
    },
    filterWhiteColorLogotypes(accountName) {
      const whiteLogotypes = ['witval', 'forbole'];

      return whiteLogotypes.find(
        (logoName) => accountName.toLowerCase() === logoName,
      );
    },
    getValidatorLogo(validator) {
      const name = validator.account_name.toLowerCase();
      const isHttps = new URL(validator.media_info.logotype).protocol === 'https:';

      if (name === 'everstake') return everstakeIcon;

      if (isHttps) {
        return validator.media_info.logotype;
      }

      return oasisLogo;
    },
  },
  async created() {
    this.fetchList('getValidators', { limit: this.getRequestLimit });
  },
};
</script>

<style lang="scss">
@import '~@/assets/styles/list';

.validators-list {
  &__status {
    font-weight: 600;

    &--active {
      color: #28a745;
    }

    &--inactive {
      color: #dc3545;
    }
  }

  &__logo {
    display: inline-block;
    max-height: 30px;
    max-width: 30px;
    margin-right: 5px;
    border-radius: 4px;
  }
}

.table {
  &__validators {
    & td:nth-child(2),
    & td:nth-child(3) {
      max-width: 200px;
    }
  }

  &__uptime {
    max-width: 160px;
  }

  &__status {
    padding-left: 3px !important;
    padding-right: 3px !important;
  }
}
</style>
