<template>
  <div class="logo">
    <router-link class="logo__link" :to="{ name: 'home' }">
     <img class="logo__img" src="../assets/images/logo.svg" alt="Oasis logotype">
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'TheLogotype',
};
</script>

<style lang="scss">
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;

    &__link {
      &:hover {
        text-decoration: none;
      }
    }

    &__text {
      margin-bottom: 0;
      font-size: 35px;
      font-weight: 700;
      text-transform: uppercase;
      text-shadow: 2px 3px 0 rgba(51, 51, 51, .4);
      letter-spacing: 2px;
      color: #333;
    }

    &--white {
      & .logo__text {
        color: #fff;
        text-shadow: 2px 3px 0 #333;

        &:hover {
          color: #fff;
        }
      }
    }
  }
</style>
