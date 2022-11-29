<template>
  <div
    id="app"
    ref="page"
    class="page"
  >
    <TheHeader class="page__header" />

    <!--    <Banner />-->

    <main class="page__main">
      <router-view />
    </main>

    <notifications
      position="top left"
      class="page__notifications"
    />

    <TheFooter class="page__footer" />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
// import Banner from './components/Banner.vue';

export default {
  name: 'App',
  components: {
    // Banner,
    TheHeader,
    TheFooter,
  },
};
</script>

<style lang="scss">
@import './assets/styles/index';
</style>
