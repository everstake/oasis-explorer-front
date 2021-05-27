<template>
  <div class="blocks">
    <Breadcrumbs
      class="breadcrumbs"
      :crumbs="breadcrumbs"
    />

    <b-container fluid="lg">
      <BlocksList />
    </b-container>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import BlocksList from '@/components/BlocksList.vue';

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
};
</script>
