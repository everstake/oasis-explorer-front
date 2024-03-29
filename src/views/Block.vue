<template>
  <div
    :key="$route.params.id"
    class="block"
  >
    <Breadcrumbs
      class="breadcrumbs"
      :crumbs="breadcrumbs"
    />

    <b-container
      class="block__container"
      fluid="lg"
    >
      <b-row v-if="loading && !block">
        <b-col cols="12">
          <div class="text-center block__loading">
            <font-awesome-icon
              class="icon block__icon"
              icon="spinner"
              spin
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="block">
        <b-col
          cols="12"
          md="4"
        >
          <b-card header="General information">
            <b-card-text class="block__content">
              <div class="block__header">
                Block height
              </div>
              <div class="block__navigation">
                <div
                  :disabled="Number($route.params.id) === 0"
                  :class="{
                    'card__block-prev--disabled':
                      Number($route.params.id) === 0,
                  }"
                  class="card__block-prev"
                  @click="
                    onNavigation('prev', Number($route.params.id) === 0)
                  "
                >
                  <font-awesome-icon
                    icon="chevron-left"
                    class="ml-1"
                  />
                </div>
                {{ block.level }}
                <div
                  :disabled="Number($route.params.id) === height"
                  :class="{
                    'card__block-prev--disabled':
                      Number($route.params.id) === height,
                  }"
                  class="card__block-next"
                  @click="
                    onNavigation('next', Number($route.params.id) === height)
                  "
                >
                  <font-awesome-icon
                    icon="chevron-right"
                    class="mr-1"
                  />
                </div>
              </div>
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Block hash
              </div>
              <div
                class="block__copy"
                @click="copyToClipboard(block.hash)"
              >
                <span :ref="block.hash">
                  {{ block.hash }}
                </span>
                <font-awesome-icon
                  :icon="['fas', 'copy']"
                  :class="{
                    'icon--success': isHashCopied(block.hash),
                  }"
                  class="icon icon-copy delegator-card__icon"
                />
              </div>
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Epoch
              </div>
              {{ block.epoch }}
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Proposer
              </div>
              <div
                class="block__copy"
                @click="copyToClipboard(block.proposer)"
              >
                <span :ref="block.proposer">
                  {{ block.proposer }}
                </span>
                <font-awesome-icon
                  :icon="['fas', 'copy']"
                  :class="{
                    'icon--success': isHashCopied(block.proposer),
                  }"
                  class="icon icon-copy delegator-card__icon"
                />
              </div>
            </b-card-text>
            <b-card-text
              v-if="block.number_of_signatures"
              class="block__content"
            >
              <div class="block__header">
                Signatures
              </div>
              {{ block.number_of_signatures }}
            </b-card-text>
            <b-card-text
              v-if="block.number_of_txs"
              class="block__content"
            >
              <div class="block__header">
                Operations
              </div>
              {{ block.number_of_txs }}
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Date
              </div>
              {{ block.timestamp | formatDate }}
              <div class="block__time-ago">
                ({{ block.timestamp | formatDaysAgo }})
              </div>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col
          cols="12"
          md="8"
        >
          <b-card
            no-body
          >
            <CommonTable
              request-name="getTransactions"
              :fields="fields"
              :fetch-params="fetchParams"
              height="min-content"
            >
              <template #cell(fees)="{ item: { fees } }">
                {{ fees || '-' }}
              </template>

              <template #cell(hash)="{ item: { hash } }">
                <router-link
                  v-if="hash"
                  :to="{ name: 'operation', params: { id: hash } }"
                >
                  {{ hash | trimHashFromTo(7, -7) }}
                </router-link>

                <span v-else>-</span>
              </template>

              <template #cell(from)="{ item: { from }}">
                <router-link
                  v-if="from"
                  :to="{ name: 'account', params: { id: from } }"
                >
                  {{ from | trimHashFromTo(6, -6) }}
                </router-link>

                <span v-else>-</span>
              </template>

              <template #cell(to)="{ item: { to }}">
                <router-link
                  v-if="to"
                  :to="{ name: 'account', params: { id: to } }"
                >
                  {{ to | trimHashFromTo(6, -6) }}
                </router-link>

                <span v-else>-</span>
              </template>

              <template #cell(proposer)="{ item: { proposer } }">
                {{ proposer || '-' }}
              </template>

              <template #cell(timestamp)="{ item: { timestamp } }">
                {{ timestamp | formatDate }}
              </template>

              <template #cell(amount)="{ item: { amount } }">
                {{ amount | formatAmount }}
              </template>

              <template #cell(gas_used)="{ item: { gas_used } }">
                {{ gas_used || '-' }}
              </template>
            </CommonTable>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="12">
          <div class="text-center block__empty">
            No data
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
import CommonTable from '../components/CommonTable/CommonTable.vue';

export default {
  name: 'Block',
  components: {
    Breadcrumbs,
    CommonTable,
  },
  mixins: [
    copyToClipboard,
  ],
  data() {
    return {
      loading: false,
      block: null,
      fields: [
        { key: 'hash', label: 'Hash', class: 'cell-s' },
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount' },
        { key: 'type', label: 'Type' },
        { key: 'timestamp', label: 'Date' },
      ],
      fetchParams: {},
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
    };
  },
  computed: {
    ...mapState(['height']),
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        this.setFetchParams();
        this.fetch();
      },
    },
  },
  methods: {
    ...mapMutations(['setInfo']),
    onNavigation(position, disabled) {
      if (disabled) {
        return;
      }

      const { id } = this.$route.params;
      const params = { id };

      switch (position) {
        case 'prev':
          params.id = id > 0 ? id - 1 : 0;
          break;
        case 'next':
          params.id = Number(id) + 1;
          break;
        default:
      }

      this.$router.push({
        name: 'block',
        params,
      });
    },
    setFetchParams() {
      const params = {};

      const { id } = this.$route.params;

      if (Number.isInteger(Number(id))) {
        params.block_level = id;
      } else {
        params.block_id = id;
      }

      this.fetchParams = params;
    },
    async fetch() {
      this.loading = true;

      try {
        await Promise.all([
          this.height || this.fetchInfo(),
          this.fetchBlock(),
        ]);
      } catch (e) {
        this.$router.push({ name: '404' });
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async fetchInfo() {
      const response = await this.$api.getInfo();

      if (response.status !== 200) {
        throw new Error(response);
      }

      this.setInfo(response.data);
    },
    async fetchBlock() {
      this.block = null;

      const response = await this.$api.getBlocks({
        ...this.fetchParams,
      });

      if (response.status !== 200) {
        throw new Error(response);
      }

      [this.block] = response.data;
    },
  },
};
</script>

<style lang="scss">
  .block__container {
    margin-bottom: 52px;
  }

.card__block-next,
.card__block-prev {
  cursor: pointer;
}
.card__block-prev--disabled {
  color: rgba(0, 0, 0, 0.3);
  cursor: text;
  pointer-events: none;
}
</style>
