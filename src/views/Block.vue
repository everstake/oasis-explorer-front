<template>
  <div class="block">
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
        <b-col cols="4">
          <div class="block__section">
           <b-card
            header="General information"
          >
            <b-card-text class="block__content">
              <div class="block__header">Block height</div>
              {{ items[0].level }}
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">Block hash</div>
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
               <div class="block__header">Epoch</div>
               {{ items[0].epoch }}
             </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">Date</div>
              {{ items[0].timestamp | formatDate }}
            </b-card-text>
          </b-card>
          </div>
        </b-col>
        <b-col cols="8">
          <div class="block__section block__section--table">
            <b-card>
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
                  {{ items.item.to === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
                  ? 'System Account' : !items.item.to ? '-' : items.item.to }}
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
                <template #cell(gas_used)="items">
                  {{ !items.item.gas_used ? '-' : items.item.gas_used }}
                </template>
              </b-table>
              <b-pagination
                v-model="currentPage"
                :total-rows="items.length"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </b-card>
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
  name: 'Block',
  components: {
    Breadcrumbs,
    TableLoader,
  },
  mixins: [
    copyToClipboard,
  ],
  watch: {
    // '$route.params': {
    //   async handler(val) {
    //     console.log(val);
    //     this.loading = true;
    //     const options = {};
    //
    //     if (val.level) options.block_level = val.level;
    //     if (val.hash) options.block_id = val.hash;
    //
    //     console.log('options', options);
    //
    //     const data = await this.$api.getBlocks({
    //       limit: 50,
    //       ...options,
    //     });
    //     if (data.status !== 200) {
    //       this.$router.push({ name: '404' });
    //     }
    //     this.items = data.data;
    //     this.loading = false;
    //   },
    // },
  },
  data() {
    return {
      level: null,
      id: null,
      data: {
        blockHeight: 0,
        blockHash: 'tx12345',
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
      response: {
        epoch: 0,
        fees: 0,
        gas_used: 0,
        hash: null,
        level: 0,
        number_of_txs: 0,
        numbet_of_signatures: 0,
        proposer: null,
        timestamp: 0,
      },
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'blocks',
          text: 'Blocks',
        },
        {
          text: this.$route.params.id,
          active: true,
        },
      ],
      loading: null,
      limit: 50,
      items: null,
      fields: [
        { key: 'hash', label: 'Hash' },
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount' },
        { key: 'timestamp', label: 'Date' },
      ],
      currentPage: 0,
      perPage: 5,
    };
  },
  async created() {
    this.loading = true;
    const options = {};

    const isLevel = Number.isInteger(Number(this.$route.params.id));

    if (isLevel) {
      options.block_level = this.$route.params.id;
    } else {
      options.block_id = this.$route.params.id;
    }

    const data = await this.$api.getBlocks({
      limit: 50,
      ...options,
    });
    if (data.status !== 200) {
      this.$router.push({ name: '404' });
    }
    this.items = data.data;
    this.loading = false;
  },
};
</script>
