<template>
  <v-lazy-image
    :ref="src"
    :src-placeholder="oasisLogo"
    :src="logoSrc"
    :alt="`${accountName} logotype`"
    :class="{ 'block__logotype--white': isLogoWhite }"
    class="validators-list__logo"
  >
  </v-lazy-image>
</template>

<script>
import VLazyImage from 'v-lazy-image';
import everstakeIcon from '@/assets/images/icon-everstake.png';
import oasisLogo from '@/assets/images/logo-oasis.svg';

export default {
  name: 'AccountLogotype',
  components: { VLazyImage },
  props: {
    src: String,
    accountName: String,
  },
  computed: {
    logoSrc() {
      if (this.accountName.toLowerCase() === 'everstake') {
        return everstakeIcon;
      }

      const isHttps = new URL(this.src).protocol === 'https:';

      if (isHttps) {
        return this.src;
      }

      return oasisLogo;
    },
    isLogoWhite() {
      const whiteLogotypes = ['witval', 'forbole'];

      return whiteLogotypes.find(
        (logoName) => this.accountName.toLowerCase() === logoName,
      );
    },
  },
  methods: {
    onError(e) {
      e.target.src = oasisLogo;
    },
  },
  mounted() {
    this.$refs[this.src].$el.addEventListener('error', this.onError);
  },
  beforeDestroy() {
    this.$refs[this.src].$el.removeEventListener('error', this.onError);
  },
};
</script>
