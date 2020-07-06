<template>
  <div class="transactions">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />
    <b-container fluid="lg">
      <AccountsList ref="AccountsList" />
    </b-container>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import AccountsList from '@/components/AccountsList.vue';

export default {
  name: 'Accounts',
  components: {
    Breadcrumbs,
    AccountsList,
  },
  data() {
    return {
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'accounts',
          text: 'Accounts',
          active: true,
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      const data = await this.$api.getAccounts({ limit: this.limit });

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
