<template>
  <div class="transactions">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />
    <b-container fluid="lg">
      <OperationsList ref="operationsList" :filters="true" />
    </b-container>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import OperationsList from '@/components/OperationsList.vue';

export default {
  name: 'Operations',
  components: {
    Breadcrumbs,
    OperationsList,
  },
  data() {
    return {
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'operations',
          text: 'Operations',
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
