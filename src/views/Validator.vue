<template>
  <div class="transaction">
    <Breadcrumbs class="breadcrumbs validator__breadcrumbs" :crumbs="breadcrumbs" />

    <b-container>
      <b-row v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center block__loading">
            <font-awesome-icon class="icon block__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="!loading && (Array.isArray(items) && items.length === 0)">
        <b-col cols="12">
          <div class="text-center transaction__empty">
            No data
          </div>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="3">
          <div class="validator__section transaction__section">
            <b-card
              class="validator__info"
              header="Operation information"
            >
              <b-card-text
                v-if="items[0].account_name"
                class="block__content"
              >
                <div class="block__header">Name</div>
                {{ items[0].account_name }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Address</div>
                <div
                  @click="copyToClipboard(items[0].account_id)"
                  class="block__copy"
                >
                  <span
                    :ref="items[0].account_id"
                  >
                    {{ items[0].account_id }}
                  </span>
                  <font-awesome-icon
                    :icon="['fas', 'copy']"
                    :class="{
                      'icon--success': isHashCopied
                    }"
                    class="icon icon-copy delegator-card__icon"
                  />
                </div>
              </b-card-text>
              <b-card-text v-if="items[0].escrow_balance" class="block__content">
                <div class="block__header">Escrow balance</div>
                {{ items[0].escrow_balance | formatAmount }}
              </b-card-text>
              <b-card-text v-if="items[0].signatures_count" class="block__content">
                <div class="block__header">Signatures</div>
                {{ items[0].signatures_count }}
              </b-card-text>
              <b-card-text v-if="items[0].blocks_count" class="block__content">
                <div class="block__header">Proposals (blocks_count)</div>
                {{ items[0].blocks_count }}
              </b-card-text>
              <b-card-text class="block__content">
                <div
                  v-if="items[0].depositors_count"
                  class="block__header"
                >
                  Depositors (depositors_count)
                </div>
                {{ items[0].depositors_count }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header" v-if="items[0].available_score">Available score</div>
                {{ items[0].available_score | formatAmount }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Fee</div>
                {{ items[0].fee }}
              </b-card-text>
              <b-card-text class="block__content">
                  <div
                    v-if="items[0].status"
                    :class="{
                      'validator__status--active': items[0].status === 'active',
                      'validator__status--inactive': items[0].status === 'inactive'
                    }"
                  >
                    <div class="block__header">Status</div>
                    <font-awesome-icon
                      v-if="items[0].status === 'active'"
                      icon="check-circle"
                    />
                    <font-awesome-icon
                      v-else-if="items[0].status === 'inactive'"
                      icon="times-circle"
                    />
                  </div>
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header" v-if="items[0].validate_since">Validate since</div>
                {{ items[0].validate_since | formatDate }}
                <div class="date-from-now">
                  ({{ items[0].validate_since | formatDaysAgo }})
                </div>
              </b-card-text>
            </b-card>
          </div>
        </b-col>
        <b-col cols="9">
          <div class="block__section">
            <div class="block__section block__section--table">
              <b-card class="validator__card">
                <div class="validator__actions">
                  <b-btn
                    class="validator__btn"
                    @click="handleTableUpdate('delegators')"
                  >
                    Delegators
                  </b-btn>
                </div>
                <div class="validator__shadow">
                  <b-table
                    id="my-table"
                    :busy="loading && delegators === null"
                    :responsive="true"
                    show-empty
                    :fields="fields"
                    :items="delegators"
                    class="table table--border table-list validator__table"
                    borderless
                    no-border-collapse
                  >
                    <template #table-busy>
                      <TableLoader />
                    </template>
                    <template #cell(account_id)="delegators">
                      <span
                        v-if="delegators.item.account_id === $route.params.id"
                      >
                        {{ delegators.item.account_id }}
                      </span>
                      <router-link
                        v-else
                        :to="{ name: 'account', params: { id: delegators.item.account_id } }"
                      >
                        {{ delegators.item.account_name || delegators.item.account_id }}
                      </router-link>
                    </template>
                    <template #cell(escrow_amount)="delegators">
                      {{ delegators.item.escrow_amount | formatAmount }}
                    </template>
                    <template #cell(delegate_since)="delegators">
                      {{ delegators.item.delegate_since | formatYear }}
                      <div class="date-from-now">
                        {{ delegators.item.delegate_since | formatDaysAgo }}
                      </div>
                    </template>
                    <template #cell(hash)="delegators">
                      {{ !delegators.item.hash ? '-' : delegators.item.hash }}
                    </template>
                    <template #cell(to)="delegators">
                      <div class="table__hash">
                        <span v-if="!delegators.item.to">-</span>
                        <span
                          v-else-if="delegators.item.to ===
                          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='"
                        >
                          System Account
                        </span>
                        <router-link
                          v-else
                          :to="{ name: 'account', params: { id: delegators.item.to } }"
                        >
                          {{ delegators.item.to }}
                        </router-link>
                      </div>
                    </template>
                    <template #cell(from)="delegators" class="table__hash">
                      <div class="table__hash">
                        <span v-if="!delegators.item.from">-</span>
                        <router-link
                          v-else
                          :to="{ name: 'account', params: { id: delegators.item.from } }"
                        >
                          {{ delegators.item.from }}
                        </router-link>
                      </div>
                    </template>
                    <template #cell(proposer)="delegators">
                      {{ !delegators.item.proposer ? '-' : delegators.item.proposer }}
                    </template>
                    <template #cell(timestamp)="delegators">
                      {{ delegators.item.timestamp | formatDate }}
                    </template>
                    <template #cell(amount)="delegators">
                      {{ delegators.item.amount | formatAmount }}
                    </template>
                    <template #cell(storage)="delegators">
                      {{ !delegators.item.storage ? '-' : delegators.item.storage }}
                    </template>
                    <template #cell(gas_used)="delegators">
                      {{ !delegators.item.gas_used ? '-' : delegators.item.gas_used }}
                    </template>
                    <template #cell(fees)="delegators">
                      {{ !delegators.item.fees ? '-' : delegators.item.fees }}
                    </template>
                  </b-table>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="delegators.length"
                    :per-page="perPage"
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </b-card>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import TableLoader from '@/components/TableLoader.vue';
import copyToClipboard from '@/mixins/copyToClipboard';

export default {
  name: 'Validator',
  components: {
    Breadcrumbs,
    TableLoader,
  },
  mixins: [
    copyToClipboard,
  ],
  data() {
    return {
      data: {
        blockHeight: 0,
        blockHash: 0,
        epoch: 0,
        timestamp: 0,
        blockTime: 0,
        proposer: 0,
        numOfSignatures: 0,
        gas: 0,
        fees: 0,
        from: 0,
        to: 0,
        type: null,
        amount: 0,
      },
      loading: null,
      limit: 50,
      items: null,
      delegators: [],
      fields: [
        { key: 'account_id', label: 'Account' },
        { key: 'escrow_amount', label: 'Escrow amount', sortable: true },
        { key: 'delegate_since', label: 'Delegate since', sortable: true },
      ],
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'validators',
          text: 'Validators',
        },
        {
          text: `${this.$route.params.id}`,
          active: true,
        },
      ],
      currentPage: 1,
      perPage: 5,
    };
  },
  methods: {
    handleTableUpdate(list) {
      console.log('list', list);
    },
  },
  async created() {
    this.loading = true;

    const data = await this.$api.getValidator({
      limit: 50,
      id: this.$route.params.id,
    });

    if (data.status !== 200) {
      this.$router.push({ name: '404' });
    }
    this.items = data.data;

    this.loading = false;
  },
};
</script>

<style lang="scss">
.validator {
  &__breadcrumbs {
    margin-bottom: 35px;
  }

  &__section {
  }

  &__card {
    box-shadow: none;

    & .card-body {
      flex-grow: 0;
    }
  }

  &__shadow {
    height: 100%;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  }

  &__actions {
    margin-bottom: 15px;
  }

  &__btn {
    background-color: #4cd4a9 !important;
    border-color: #4cd4a9 !important;

    &:focus,
    &:active,
    &:hover,
    &:active:focus {
      box-shadow: 0 0 0 0.2rem rgba(76, 212, 169, .5) !important;
    }
  }

  &__table {
  }

  &__status {
    &--active {
      color: #28a745;
    }

    &--inactive {
      color: #dc3545;
    }
  }
}
</style>
