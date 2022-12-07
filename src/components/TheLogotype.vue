<template>
  <div class="logo">
    <router-link
      class="logo__link"
      :to="{ name: 'home' }"
    >
      <img
        class="logo__img"
        src="../assets/images/logo.svg"
        alt="Oasis logotype"
      >
    </router-link>
    <a
      href="https://everstake.one/"
      class="logo__link"
      target="_blank"
      rel="referrer"
    >
      <span class="logo__note">
        by
        <img
          class="logo__everstake"
          src="../assets/images/logo-everstake.svg"
          alt="Everstake logotype"
        >
      </span>
    </a>
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
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

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
    text-shadow: 2px 3px 0 rgba(51, 51, 51, 0.4);
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

  &__special {
    &:hover {
      text-decoration: none;
    }
  }

  &__note {
    margin-right: 3px;
    font-family: $nunito;
    font-size: 17px;
    color: #111;
    font-weight: bold;
    user-select: none;
  }

  &__everstake {
    width: 130px;
    color: #111;

    @media (max-width: 420px) {
      max-width: 115px;
      width: 100%;
    }
  }
}
</style>
