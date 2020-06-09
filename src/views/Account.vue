<template>
  <div class="account">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <b-container>
      <b-row v-if="loading && items === null">
        <b-col cols="12">
          <div class="text-center account__loading">
            <font-awesome-icon class="icon account__icon" icon="spinner" spin />
          </div>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="12">
          <div class="account__section">
            <b-card
              header="Account information"
            >
              <b-card-text class="account__content">
                <b-row>
                  <b-col cols="6">
                    <div class="account__item">
                      Address:
                      <p class="account__value">{{ items.address }}</p>
                    </div>
                    <div class="account__item">
                      Entity address:
                      <p class="account__value">{{items.entity_address }}</p>
                    </div>
                    <div class="account__item">
                      Created at:
                      <p class="account__value">{{items.created_at | formatUTCDate }}</p>
                    </div>
                    <div class="account__item">
                      Last active:
                      <p class="account__value">{{items.last_active | formatUTCDaysAgo }}</p>
                    </div>
                    <div class="account__item">
                      Type:
                      <p class="account__value">{{items.type }}</p>
                    </div>
                    <div class="account__item">
                      Validator:
                      <p class="acct__value">{{items.validator ? items.validator : '-' }}</p>
                    </div>
                  </b-col>
                  <b-col cols="6">
                    <div class="account__item">
                      Liquid balance:
                      <p class="account__value">{{ items.liquid_balance }}</p>
                    </div>
                    <div class="account__item">
                      Escrow balance:
                      <p class="account__value">{{items.escrow_balance }}</p>
                    </div>
                    <div class="account__item">
                      Debonding balance:
                      <p class="account__value">{{items.debonding_balance }}</p>
                    </div>
                    <div class="account__item">
                      Total balance:
                      <p class="account__value">{{items.total_balance }}</p>
                    </div>
                    <div class="account__item">
                      Nonce:
                      <p class="account__value">{{items.nonce }}</p>
                    </div>
                 </b-col>
                </b-row>
              </b-card-text>
            </b-card>
          </div>
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
  async created() {
    this.loading = true;

    const data = await this.$api.getAccounts({ id: this.$route.params.id });

    // if (data.status !== 200) {
    //   this.$router.push({ name: '404' });
    // }

    this.items = data.data;
    this.loading = false;
  },
};
</script>

<style lang="scss">
  .account {
    &__content {}
    &__item {
      color: #999;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    }
    &__value {
      color: #333;
    }
  }
</style>
