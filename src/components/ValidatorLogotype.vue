<template>
  <VLazyImage
    :src-placeholder="placeholderSrc"
    :src="logoSrc"
    :alt="`${accountName} logotype`"
    :class="['logotype', { 'logotype--bg-black': isLogoWhite }]"
    @error="onError"
  />
</template>

<script>
import VLazyImage from '@hzzt/v-lazy-image';
import everstakeIcon from '@/assets/images/icon-everstake.png';
import oasisLogo from '@/assets/images/logo-oasis.svg';

export default {
  name: 'ValidatorLogotype',
  components: { VLazyImage },
  props: {
    src: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      placeholderSrc: oasisLogo,
      hasError: false,
    };
  },
  computed: {
    logoSrc() {
      if (this.hasError) {
        return this.placeholderSrc;
      }

      if (this.accountName.toLowerCase() === 'everstake') {
        return everstakeIcon;
      }

      const isHttps = new URL(this.src).protocol === 'https:';

      if (isHttps) {
        return this.src;
      }

      return this.placeholderSrc;
    },
    isLogoWhite() {
      if (this.hasError) {
        return false;
      }
      const blackLogotypes = ['everstake', 'witval', 'forbole'];

      return blackLogotypes.find(
        (logoName) => this.accountName.toLowerCase() === logoName,
      );
    },
  },
  methods: {
    onError() {
      this.hasError = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.logotype {
  &--bg-black {
    padding: 10px;
    background-color: #000;
  }
}
</style>
