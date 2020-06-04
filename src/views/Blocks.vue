<template>
  <div class="blocks">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <b-container>
      <BlocksList ref="blocksList" />
    </b-container>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import BlocksList from '@/components/BlocksList.vue';
/* eslint-disable */

export default {
  name: 'Blocks',
  components: {
    Breadcrumbs,
    BlocksList,
  },
  data() {
    return {
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          toRouteName: 'blocks',
          text: 'Blocks',
          active: true,
        },
      ],
    };
  },
  methods: {
    handleRowClick() {
      return false;
    },
    async fetchData() {
      const data = await this.$api.getBlocks({ limit: this.limit += 50 });

      return data.data;
    },
    handleScroll(e) {
      this.scroll = window.scrollY || window.scrollTop
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>
