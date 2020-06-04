<template>
  <div class="transactions">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />
    <b-container>
      <TransactionsList ref="transactionsList" />
    </b-container>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import TransactionsList from '@/components/TransactionsList.vue';

export default {
  name: 'Transactions',
  components: {
    Breadcrumbs,
    TransactionsList,
  },
  data() {
    return {
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'transactions',
          text: 'Transactions',
          active: true,
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      const data = await this.$api.getTransactions({ limit: this.limit });

      return data.data;
    },
    handleScroll() {
      this.scroll = window.scrollY || window.scrollTop;
    },
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
