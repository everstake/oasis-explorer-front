<template>
  <div class="resources">
    <Breadcrumbs class="breadcrumbs" :crumbs="breadcrumbs" />

    <div class="container" fluid="lg">
      <div class="resources__content">
        <p class="resources__title">Wallets</p>
        <p class="resources__text">
          <a
            href="https://docs.oasis.dev/hsm/ledger.html#prerequisites"
            target="_blank"
            >Ledger</a
          >
        </p>

        <p class="resources__title">Social links</p>
        <p class="resources__text">
          <a
            href="https://app.slack.com/client/TK9CZ7USZ/CLZPDEWTA"
            target="_blank"
            >Slack</a
          >
        </p>
        <p class="resources__text">
          <a href="https://t.me/oasisprotocolcommunity" target="_blank"
            >Telegram</a
          >
        </p>
        <p class="resources__text">
          <a href="https://www.oasislabs.com/blog" target="_blank">Blog</a>
        </p>
        <p class="resources__text">
          <a
            href="https://oasisfoundation.typeform.com/to/aFYokz"
            target="_blank"
            >Dev Accelerator</a
          >
        </p>

        <p class="resources__title">Documentation</p>
        <p class="resources__text">
          <a href="https://docs.oasis.dev/overview.html" target="_blank"
            >Docs</a
          >
        </p>
        <p class="resources__text">
          <a href="https://github.com/oasislabs" target="_blank">Github</a>
        </p>
        <p class="resources__text">
          <a href="https://oasisprotocol.org/papers" target="_blank"
            >Research papers</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs.vue';

export default {
  name: 'Resources',
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
          text: 'Resources',
          active: true,
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.resources {
  &__content {
    margin-bottom: 50px;

    @include from-768-down {
      margin-bottom: 100px;
    }

    padding: 40px;
    border-radius: 4px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  }

  &__title {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bold;

    &:not(:first-child) {
      margin-top: 50px;
    }
  }

  &__text {
    overflow-wrap: break-word;
  }
}
</style>
