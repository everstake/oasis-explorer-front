<template>
  <div id="app" class="page" ref="page">
    <TheHeader class="page__header" />

    <main class="page__main">
      <router-view />
    </main>

    <notifications position="top left" class="page__notifications" />

    <TheFooter class="page__footer" />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
  },
};
</script>

<style lang="scss">
@import '~@/assets/styles/index.scss';
</style>
