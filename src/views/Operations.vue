<template>
  <div class="transactions">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />
    <b-container fluid="lg">
      <OperationsList :filters="true" />
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
};
</script>
