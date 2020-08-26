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
          <span v-if="data.item.media_info">
            <v-lazy-image
              v-if="data.item.media_info.logotype"
              :src-placeholder="require('../assets/images/logo-oasis.svg')"
              :src="
                data.item.account_name.toLowerCase() === 'everstake'
                  ? everstakeIcon
                  : data.item.media_info.logotype
              "
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
          {{ data.item.account_name || data.item.account_id }}
        </router-link>
      </template>
      <template #cell(escrow_balance)="items">
        {{ items.item.escrow_balance | formatAmount }}
      </template>
      <template #cell(available_score)="items">
        {{ items.item.available_score }}
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
      <template #cell(validate_since)="items">
        {{ items.item.validate_since | formatYear }}
        <div class="date-from-now">
          {{ items.item.validate_since | formatDaysAgo }}
        </div>
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
          'blocks-list__button--loading': loading,
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
import everstakeIcon from '@/assets/images/icon-everstake.png';
import VLazyImage from 'v-lazy-image';

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
        { key: 'available_score', label: 'Availability', sortable: true },
        { key: 'depositors_count', label: 'Delegators' },
        { key: 'blocks_count', label: 'Proposals', sortable: true },
        { key: 'signatures_count', label: 'Signatures', sortable: true },
        { key: 'fee', label: 'Fee', sortable: true },
        { key: 'status', label: 'Status' },
        { key: 'validate_since', label: 'Registered', sortable: true },
      ],
      everstakeIcon,
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
  },
  async created() {
    this.fetchList('getValidators', { limit: this.getRequestLimit });
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
}
</style>
