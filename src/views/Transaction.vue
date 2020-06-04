<template>
  <div class="transaction">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <b-container>
      <b-row v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center block__loading">
            <font-awesome-icon class="icon block__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="3">
          <div class="transaction__section">
            <b-card
              header="Transaction information"
            >
              <b-card-text class="block__content">
                <div class="block__header">Block height</div>
                {{ items[0].level }}
              </b-card-text>
              <b-card-text class="block__content">
                <div class="block__header">Transaction hash</div>
                <div
                  @click="copyToClipboard(items[0].hash)"
                  class="block__copy"
                >
                  <span
                    :ref="items[0].hash"
                  >
                    {{ items[0].hash }}
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
              <b-card-text class="block__content">
                <div class="block__header">Date</div>
                {{ items[0].timestamp | formatDate }}
              </b-card-text>
              <b-card-text v-if="items[0].epoch" class="block__content">
                <div class="block__header">Epoch</div>
                {{ items[0].epoch }}
              </b-card-text>
              <b-card-text v-if="items[0].nonce" class="block__content">
                <div class="block__header">Nonce</div>
                {{ items[0].nonce }}
              </b-card-text>
            </b-card>
          </div>
        </b-col>
        <b-col cols="9">
          <div class="block__section">
            <b-table
              :busy="loading && items === null"
              :responsive="true"
              show-empty
              :fields="fields"
              :items="items"
              class="table table--border"
              borderless
              no-border-collapse
            >
              <template #table-busy>
                <TableLoader />
              </template>
              <template #cell(fees)="items">
                {{ !items.item.fees ? '-' : items.item.fees }}
              </template>
              <template #cell(hash)="items">
                {{ !items.item.hash ? '-' : items.item.hash }}
              </template>
              <template #cell(from)="items">
                {{ !items.item.from ? '-' : items.item.from }}
              </template>
              <template #cell(to)="items">
                {{ !items.item.to ? '-' : items.item.to }}
              </template>
              <template #cell(proposer)="items">
                {{ !items.item.proposer ? '-' : items.item.proposer }}
              </template>
              <template #cell(timestamp)="items">
                {{ items.item.timestamp | formatDate }}
              </template>
              <template #cell(amount)="items">
                {{ !items.item.amount ? '-' : items.item.amount }}
              </template>
              <template #cell(storage)="items">
                {{ !items.item.storage ? '-' : items.item.storage }}
              </template>
              <template #cell(gas_used)="items">
                {{ !items.item.gas_used ? '-' : items.item.gas_used }}
              </template>
            </b-table>
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
  name: 'Transaction',
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
      fields: [
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount' },
        { key: 'gas_used', label: 'Gas' },
        { key: 'storage', label: 'Storage' },
        { key: 'fees', label: 'Fees' },
      ],
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'transactions',
          text: 'Transactions',
        },
        {
          text: `${this.$route.params.hash}`,
          active: true,
        },
      ],
    };
  },
  async created() {
    this.loading = true;
    const data = await this.$api.getTransactions({
      limit: 50,
      operation_id: this.$route.params.hash,
    });
    this.items = data.data;
    this.loading = false;
  },
};
</script>
