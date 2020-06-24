<template>
  <b-nav
      class="page-nav"
      >
      <b-nav-item class="page-nav__item">
        <router-link
          to="/"
          exact
          class="page__link page-nav__link"
        >
          Home
        </router-link>
      </b-nav-item>
      <b-nav-item class="page-nav__item">
        <router-link
          to="/blocks"
          class="page__link page-nav__link"
        >
          Blocks
        </router-link>
      </b-nav-item>
      <b-nav-item class="page-nav__item">
        <router-link
          to="/operations"
          class="page__link page-nav__link"
        >
          Operations
        </router-link>
      </b-nav-item>

      <b-nav-item class="page-nav__item">
        <router-link class="page__link page-nav__link" :to="{ name: 'validators' }">
          Validators
        </router-link>
      </b-nav-item>

      <b-nav-item class="page-nav__item">
        <router-link class="page__link page-nav__link" :to="{ name: 'accounts' }">
          Accounts
        </router-link>
      </b-nav-item>

    <b-nav-item class="page-nav__item">
      <router-link class="page__link page-nav__link" :to="{ name: 'stats' }">
        Stats
      </router-link>
    </b-nav-item>

    <b-nav-item to="/resources" class="page-nav__item">
      <router-link class="page__link page-nav__link" :to="{ name: '404' }">
        Resources
      </router-link>
    </b-nav-item>
  </b-nav>
</template>

<script>
export default {
  name: 'TheMenu',
};
</script>

<style lang="scss">
  .page {
    &-nav {
      & .router-link-active {
        color: $color-primary-hover;
        text-decoration: none;
      }

      & .router-link-active.dropdown-item {
        color: $color-white;
        background-color: $color-primary;
        text-decoration: none;

        &:hover,
        &:focus {
          color: $color-white;
          background-color: $color-primary;
          text-decoration: none;
        }
      }
    }
    &__link {
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;

      &:hover {
        text-decoration: none;
      }

      & .dropdown-item {
        font-size: 15px;
        font-weight: 700;
        text-transform: uppercase;
        color: $color-primary;

        &:hover {
          color: $color-primary-hover;
        }

        &:focus {
          color: $color-primary-hover;
        }

        &:active:focus {
          color: $color-white;
        }
      }
    }
  }
</style>
