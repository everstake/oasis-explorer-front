<template>
  <div class="validators">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />
    <b-container fluid="lg">
      <ValidatorsList ref="ValidatorsList" />
    </b-container>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import ValidatorsList from '@/components/ValidatorsList.vue';

export default {
  name: 'Validators',
  components: {
    Breadcrumbs,
    ValidatorsList,
  },
  data() {
    return {
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'validators',
          text: 'Validators',
          active: true,
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      const data = await this.$api.getValidators({ limit: this.limit });

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
