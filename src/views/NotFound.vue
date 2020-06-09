<template>
  <div class="not-found">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />
    <div class="not-found__content">
      Page not found
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default {
  name: 'NotFound',
  components: {
    Breadcrumbs,
  },
  data() {
    return {
      breadcrumbs: [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          text: 'Page not found',
          active: true,
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.not-found {
  &__content {
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: $color-primary;
    text-align: center;
  }

  & .breadcrumbs {
    margin-bottom: 0;
  }
}
</style>
