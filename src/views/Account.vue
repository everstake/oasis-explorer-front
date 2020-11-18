<template>
  <div class="account" :key="$route.params.id">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <b-container fluid="lg">
      <b-row class="account__empty" v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center account__loading">
            <font-awesome-icon class="icon account__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row
        class="account__content"
        v-else-if="!loading && (Array.isArray(items) && items.length === 0)"
      >
        <b-col cols="12">
          <div class="text-center block__empty">
            No data
          </div>
        </b-col>
      </b-row>
      <b-row class="account__information" v-else>
        <b-col cols="12">
          <div class="account__section">
            <b-card
              header="Account information"
            >
              <b-card-text class="account__content">
                <b-row>
                  <b-col cols="6">
                    <div class="account__container">
                      <div class="account__item">
                        Address:
                        <p class="account__value">{{ items.address }}</p>
                      </div>
                      <div class="account__item" v-if="items.entity_address">
                        Entity address:
                        <p class="account__value">
                          <router-link
                            v-if="items.entity_address !== $route.params.id"
                            :to="{ name: 'account', params: { id: items.entity_address } }"
                          >
                            {{ items.entity_address }}
                          </router-link>
                          <span v-else>
                            {{ items.entity_address }}
                          </span>
                        </p>
                      </div>
                      <div class="account__item">
                        Type:
                        <p class="account__value">{{items.type }}</p>
                      </div>
                      <div class="account__item">
                        Last active:
                        <p class="account__value">{{items.last_active | formatUTCDaysAgo }}</p>
                      </div>
                      <div class="account__item">
                      Created at:
                      <p class="account__value">{{items.created_at | formatUTCDate }}</p>
                    </div>
                    </div>
                  </b-col>
                  <b-col cols="6">
                    <div class="account__container">
                      <div class="account__item">
                        Total balance:
                        <p class="account__value">{{items.total_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Liquid balance:
                        <p class="account__value">{{ items.liquid_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Escrow balance:
                        <p class="account__value">{{items.escrow_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                        Debonding balance:
                        <p class="account__value">{{items.debonding_balance | formatAmount }}</p>
                      </div>
                      <div class="account__item">
                      Nonce:
                      <p class="account__value">{{items.nonce }}</p>
                    </div>
                    </div>
                 </b-col>
                </b-row>
              </b-card-text>
            </b-card>
          </div>
        </b-col>
      </b-row>
      <b-row class="account__validator" v-if="items !== null && items.validator">
        <b-col cols="12">
          <b-card
            header="Validator information"
          >
            <b-card-text class="account__content">
              <b-row>
                <b-col cols="6">
                  <div class="account__container">
                    <div class="account__item">
                      Node address:
                      <p class="account__value">
                        <router-link
                          :to="{ name: 'account', params: { id: items.validator.node_address } }"
                        >
                          {{ items.validator.node_address }}
                        </router-link>
                      </p>
                    </div>
                    <div class="account__item">
                      Consensus address:
                      <p class="account__value">{{ items.validator.consensus_address }}</p>
                    </div>
                    <div class="account__item">
                      Delegators count:
                      <p class="account__value">{{ items.validator.depositors_count }}</p>
                    </div>
                    <div class="account__item">
                      Blocks count:
                      <p class="account__value">{{ items.validator.blocks_count }}</p>
                    </div>
                    <div class="account__item">
                    Signatures count:
                    <p class="account__value">{{ items.validator.signatures_count }}</p>
                  </div>
                  </div>
                </b-col>
                <b-col cols="6">
                  <div class="account__container">
                    <div class="account__item">
                      Rate change interval:
                      <p class="account__value">{{ items.validator.rate_change_interval }}</p>
                    </div>
                    <div class="account__item">
                      Rate bound lead:
                      <p class="account__value">{{ items.validator.rate_bound_lead }}</p>
                    </div>
                    <div class="account__item">
                      Max rate steps:
                      <p class="account__value">{{ items.validator.max_rate_steps }}</p>
                    </div>
                    <div class="account__item">
                      Max bound steps:
                      <p class="account__value">{{ items.validator.max_bound_steps }}</p>
                    </div>
                    <div class="account__item">
                      Status:
                      <p class="account__value">{{ items.validator.status }}</p>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import copyToClipboard from '@/mixins/copyToClipboard';

export default {
  name: 'Account',
  components: {
    Breadcrumbs,
  },
  mixins: [
    copyToClipboard,
  ],
  data() {
    return {
      loading: null,
      items: null,
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'accounts',
          text: 'Accounts',
        },
        {
          text: this.$route.params.id,
          active: true,
        },
      ],
      fields: [
        { key: 'address', label: 'Address' },
        { key: 'liquid_balance', label: 'Liquid balance' },
        { key: 'escrow_balance', label: 'Escrow balance' },
        { key: 'debonding_balance', label: 'Debonding balance' },
        { key: 'total_balance', label: 'Total balance' },
        { key: 'created_at', label: 'Created at' },
        { key: 'last_active', label: 'Last active' },
        { key: 'nonce', label: 'Nonce' },
        { key: 'type', label: 'Type' },
        { key: 'entity_address', label: 'Entity Address' },
        { key: 'validator', label: 'Validator' },
      ],
    };
  },
  methods: {
    async fetchData(id) {
      this.loading = true;

      const data = await this.$api.getAccount({ id });

      if (data.status !== 200) {
        this.$router.push({ name: '404' });
      }

      if (data.data.created_at === '1970-01-01T00:00:00Z') {
        // eslint-disable-next-line
        data.data.created_at = '2020-11-18T16:01:00Z';
      }

      this.items = data.data;
      this.loading = false;
    },
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchData(to.params.id);
      }
    },
    testFn(arg) {
      return arg;
    },
  },
  async created() {
    const { id } = this.$route.params;
    this.fetchData(id);
  },
};
</script>

<style lang="scss">
  .account {
    &__content {}
    &__container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: space-between;
      height: 100%;
    }
    &__item {
      color: $color-gray-999;

      &:last-child {
        margin-bottom: 0;
      }
    }
    &__title {
      margin-bottom: 35px;
      font-size: 24px;
      color: $color-gray-333;
    }
    &__validator {
      margin-top: 50px;
    }
    &__value {
      color: #333;
    }
    &__information {
      margin-bottom: 50px;
    }
  }
</style>
