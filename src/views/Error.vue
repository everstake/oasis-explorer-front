<template>
  <div class="not-found">
    <Breadcrumbs class="breadcrumbs" :crumbs="getBreadcrumbs" />
    <div class="not-found__content">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default {
  name: 'Error',
  components: {
    Breadcrumbs,
  },
  data() {
    return {
      errorMessage: '',
    };
  },
  computed: {
    getBreadcrumbs() {
      return [
        {
          toRouteName: 'home',
          text: 'Home',
        },
        {
          text: this.errorMessage,
          active: true,
        },
      ];
    },
  },
  created() {
    const { errorStatus } = this.$route.meta;

    if (errorStatus === 404) {
      this.errorMessage = 'Page not found';
    }

    if (errorStatus === 503) {
      this.errorMessage = 'Something went wrong';
    }
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
