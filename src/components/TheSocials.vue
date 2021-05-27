<template>
  <div class="social">
    <div
      v-if="links.twitter"
      class="social__item"
    >
      <a
        :href="links.twitter"
        target="_blank"
      >
        <font-awesome-icon
          class="icon social__icon"
          :icon="['fab', 'twitter']"
        />
      </a>
    </div>

    <div
      v-if="links.facebook"
      class="social__item"
    >
      <a
        :href="links.facebook"
        target="_blank"
      >
        <font-awesome-icon
          class="icon social__icon"
          :icon="['fab', 'facebook-square']"
        />
      </a>
    </div>

    <div
      v-if="links.medium"
      class="social__item"
    >
      <a
        :href="links.medium"
        target="_blank"
      >
        <font-awesome-icon
          class="icon social__icon"
          :icon="['fab', 'medium-m']"
        />
      </a>
    </div>

    <div
      v-if="links.telegram"
      class="social__item"
    >
      <a
        :href="links.telegram"
        target="_blank"
      >
        <font-awesome-icon
          class="icon social__icon"
          :icon="['fab', 'telegram']"
        />
      </a>
    </div>

    <div
      v-if="links.reddit"
      class="social__item"
    >
      <a
        :href="links.reddit"
        target="_blank"
      >
        <font-awesome-icon
          class="icon social__icon"
          :icon="['fab', 'reddit']"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheSocials',
  props: {
    links: {
      type: Object,
      default() {
        return {
          facebook: 'https://www.facebook.com/everstake.one',
          medium: 'https://medium.com/everstake',
          twitter: 'https://twitter.com/everstake_pool',
        };
      },
    },
  },
};
</script>

<style lang="scss">
.social {
  display: inline-flex;

  @include from-480-down {
    display: none;
  }

  &__item {
    font-size: 20px;

    &:not(:last-child) {
      margin-right: 30px;
    }
  }
}
</style>
