<template>
  <header class="header">
    <b-container>
      <TopLine />
    </b-container>
    <div class="header__menu">
      <b-container>
        <TheMenu />
      </b-container>
    </div>
  </header>
</template>

<script>
import TheMenu from '@/components/TheMenu.vue';
import TopLine from '@/components/TopLine.vue';

export default {
  name: 'TheHeader',
  components: {
    TheMenu,
    TopLine,
  },
};
</script>

<style lang="scss">
.header {
  &__menu {
    background-color: $color-primary;
    border-top: 1px solid $color-primary-transparent-01;
  }
}
</style>
