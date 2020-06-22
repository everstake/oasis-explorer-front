<template>
  <div class="block" :key="$route.params.id">
    <Breadcrumbs class="breadcrumbs" :crumbs="getBreadcrumbs" />

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
          <div class="text-center block__empty">
            No data
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
              <div class="block__navigation">
                <div
                  :disabled="Number($route.params.id) === 0"
                  @click="onNavigation('prev', Number($route.params.id) === 0)"
                  :class="{ 'card__block-prev--disabled': Number($route.params.id) === 0 }"
                  class="card__block-prev"
                >
                  <font-awesome-icon icon="chevron-left" class="ml-1"/>
                </div>
                {{ items[0].level }}
                <div
                  :disabled="Number($route.params.id) === height"
                  @click="onNavigation('next', Number($route.params.id) === height)"
                  :class="{ 'card__block-prev--disabled': Number($route.params.id) === height }"
                  class="card__block-next"
                >
                  <font-awesome-icon icon="chevron-right" class="mr-1"/>
                </div>
              </div>
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
              <div class="block__header">Proposer</div>
              {{ items[0].proposer }}
            </b-card-text>
            <b-card-text class="block__content" v-if="items[0].number_of_signatures">
              <div class="block__header">Signatures</div>
              {{ items[0].number_of_signatures }}
            </b-card-text>
            <b-card-text class="block__content" v-if="items[0].number_of_txs">
              <div class="block__header">Operations</div>
              {{ items[0].number_of_txs }}
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">Date</div>
              {{ items[0].timestamp | formatDate }}
              <div class="block__time-ago">
                ({{ items[0].timestamp | formatDaysAgo }})
              </div>
            </b-card-text>
          </b-card>
          </div>
        </b-col>
        <b-col cols="8">
          <div class="block__section block__section--table">
            <b-card>
              <b-table
                id="my-table"
                :busy="loading && items === null"
                :responsive="true"
                show-empty
                :fields="fields"
                :items="transactions"
                class="table table--border table-list"
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
                  <div class="table__hash">
                    <router-link
                      v-if="items.item.hash"
                      :to="{ name: 'operation', params: { id: items.item.hash } }"
                    >
                      {{ items.item.hash }}
                    </router-link>
                    <span v-else>-</span>
                  </div>
                </template>
                <template #cell(from)="items" class="table__hash">
                  <div class="table__hash">
                    <span v-if="!items.item.from">-</span>
                    <router-link
                      v-else
                      :to="{ name: 'account', params: { id: items.item.from } }"
                    >
                      {{ items.item.from }}
                    </router-link>
                  </div>
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
                  {{ items.item.amount | formatAmount }}
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
import { mapState, mapMutations } from 'vuex';
/* eslint-disable */

export default {
  name: 'Block',
  components: {
    Breadcrumbs,
    TableLoader,
  },
  mixins: [
    copyToClipboard,
  ],
  data() {
    return {
      level: null,
      id: null,
      transactions: null,
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
      loading: null,
      limit: 50,
      items: null,
      fields: [
        { key: 'hash', label: 'Hash' },
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount' },
        { key: 'type', label: 'Type' },
        { key: 'timestamp', label: 'Date' },
      ],
      currentPage: 1,
      perPage: 5,
    };
  },
  methods: {
    ...mapMutations(['setInfo']),
    onNavigation(position, disabled) {
      if (disabled) {
        return false;
      }
  
      const { id } = this.$route.params;

      if (position === 'prev') {
        this.$router.push({ name: 'block', params: { id: id > 0 ? id - 1 : 0 } });
        return;
      }

      if (position === 'next') {
        this.$router.push({ name: 'block', params: { id: Number(id) + 1 } });
      }
    },
  },
  computed: {
    ...mapState(['height']),
    getBreadcrumbs() {
      return [
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
      ];
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        this.items = null;
        this.loading = true;
        const options = {};

        if (this.height === null) {
          const data = await this.$api.getInfo();

          this.setInfo(data.data);
        }

        if (Number.isInteger(Number(this.$route.params.id))) {
          options.block_level = this.$route.params.id;
        } else {
          options.block_id = this.$route.params.id;
        }

        const data = await this.$api.getBlocks({
          ...options,
        });

        const transactions = await this.$api.getTransactions({
          ...options,
          limit: 20,
        });

        this.transactions = transactions.data;

        if (data.status !== 200) {
          this.$router.push({ name: '404' });
        }
        this.items = data.data;
        this.loading = false;
      }
    }
  },
};
</script>

<style lang="scss">
  .card__block-next,
  .card__block-prev {
    cursor: pointer;
  }
  .card__block-prev--disabled {
    color: rgba(0,0,0,0.3);
    cursor: text;
    pointer-events: none;
  }
</style>
