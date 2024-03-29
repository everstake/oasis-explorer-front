<template>
  <div>
    <Breadcrumbs
      class="breadcrumbs"
      :crumbs="breadcrumbs"
    />

    <b-container fluid="lg">
      <b-row v-if="loading && !transaction">
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
      <b-row v-if="transaction">
        <b-col
          cols="12"
          md="4"
        >
          <b-card
            header="Operation information"
          >
            <b-card-text class="block__content">
              <div class="block__header">
                Block height
              </div>
              <router-link
                :to="{ name: 'block', params: { id: transaction.level } }"
              >
                {{ transaction.level }}
              </router-link>
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Operation hash
              </div>
              <div
                class="block__copy"
                @click="copyToClipboard(transaction.hash)"
              >
                <span
                  :ref="transaction.hash"
                >
                  {{ transaction.hash }}
                </span>
                <font-awesome-icon
                  :icon="['fas', 'copy']"
                  :class="{
                    'icon--success': isHashCopied(transaction.hash)
                  }"
                  class="icon icon-copy delegator-card__icon"
                />
              </div>
            </b-card-text>
            <b-card-text
              v-if="transaction.epoch"
              class="block__content"
            >
              <div class="block__header">
                Epoch
              </div>
              {{ transaction.epoch }}
            </b-card-text>
            <b-card-text
              v-if="transaction.nonce"
              class="block__content"
            >
              <div class="block__header">
                Nonce
              </div>
              {{ transaction.nonce }}
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Status
              </div>
              <StatusIcon
                :status="transaction.status"
              />
            </b-card-text>
            <b-card-text
              v-if="transaction.type"
              class="block__content"
            >
              <div class="block__header">
                Type
              </div>
              {{ transaction.type }}
            </b-card-text>
            <b-card-text class="block__content">
              <div class="block__header">
                Date
              </div>
              {{ transaction.timestamp | formatDate }}
              <div class="block__time-ago">
                ({{ transaction.timestamp | formatDaysAgo }})
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
              <template #cell(hash)="{ item: { hash } }">
                {{ hash || '-' }}
              </template>

              <template #cell(to)="{ item: { to } }">
                <div>
                  <span v-if="to === $constants.SYSTEM_ACCOUNT_ID">
                    System Account
                  </span>

                  <router-link
                    v-else-if="to"
                    :to="{ name: 'account', params: { id: to } }"
                  >
                    {{ to | trimHashFromTo(6, -6) }}
                  </router-link>

                  <span v-else>-</span>
                </div>
              </template>

              <template #cell(from)="{ item: { from }}">
                <div>
                  <router-link
                    v-if="from"
                    :to="{ name: 'account', params: { id: from } }"
                  >
                    {{ from | trimHashFromTo(6, -6) }}
                  </router-link>

                  <span v-else>-</span>
                </div>
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

              <template #cell(storage)="{ item: { storage } }">
                {{ storage || '-' }}
              </template>

              <template #cell(gas_used)="{ item: { gas_used } }">
                {{ gas_used || '-' }}
              </template>

              <template #cell(fees)="{ item: { fees } }">
                {{ fees || '-' }}
              </template>
            </CommonTable>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="12">
          <div class="text-center transaction__empty">
            No data
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CommonTable from '@/components/CommonTable/CommonTable.vue';
import copyToClipboard from '@/mixins/copyToClipboard';
import StatusIcon from '@/components/StatusIcon.vue';

export default {
  name: 'Operation',
  components: {
    Breadcrumbs,
    CommonTable,
    StatusIcon,
  },
  mixins: [copyToClipboard],
  data() {
    return {
      loading: false,
      transaction: null,
      fields: [
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount' },
        { key: 'gas_used', label: 'Gas' },
        { key: 'storage', label: 'Storage' },
        { key: 'fees', label: 'Fees' },
      ],
      fetchParams: {},
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'operations',
          text: 'Operations',
        },
        {
          text: `${this.$route.params.id}`,
          active: true,
        },
      ],
    };
  },
  async created() {
    this.setFetchParams();
    this.fetch();
  },
  methods: {
    setFetchParams() {
      const params = {};

      const { id } = this.$route.params;

      if (Number.isInteger(Number(id))) {
        params.block_level = id;
      } else {
        params.operation_id = id;
      }

      this.fetchParams = params;
    },
    async fetch() {
      this.loading = true;

      try {
        const response = await this.$api.getTransactions({
          ...this.fetchParams,
        });

        if (response.status !== 200) {
          throw new Error(response);
        }

        [this.transaction] = response.data;
      } catch (e) {
        this.$router.push({ name: '404' });
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
