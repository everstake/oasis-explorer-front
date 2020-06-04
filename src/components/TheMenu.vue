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
      <b-nav-item-dropdown
        text="Operations"
        variant='link'
        class="page__link"
      >
        <b-dropdown-item
          to="/transactions"
          class="page__link"
        >
          Transactions
        </b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item to="/validators" class="page__link">
        Validators
      </b-nav-item>

      <b-nav-item to="/accounts" class="page__link">
        Accounts
      </b-nav-item>

      <b-nav-item to="/stats" class="page__link">
        Stats
      </b-nav-item>

      <b-nav-item to="/resources" class="page__link">
        Resources
      </b-nav-item>
    </b-nav>
</template>

<script>
export default {
  name: 'TheMenu',
};
</script>

<style lang="scss">
  /*.page-nav {*/
  /*  padding: 20px 0;*/
  /*  justify-content: space-around;*/
  /*  overflow: auto;*/

  /*&__list {*/
  /*    display: flex;*/
  /*    align-items: center;*/
  /*    justify-content: center;*/
  /*    margin: auto;*/
  /*    padding: 0;*/
  /*    list-style: none;*/
  /*  }*/

  /*  &__item {*/
  /*    padding: 15px 0;*/
  /*    margin-right: 40px;*/
  /*    white-space: nowrap;*/
  /*  }*/

  /*  &__link {*/
  /*    font-size: 14px;*/
  /*    font-weight: 600;*/
  /*    line-height: 23px;*/
  /*    text-transform: uppercase;*/
  /*    !*color: $color-light-gray-300;*/

  /*    &:hover {*/
  /*      color: $color-green;*/
  /*      text-decoration: none;*/
  /*    }*/

  /*    &.router-link-active {*/
  /*      color: $color-green;*/
  /*    }*!*/
  /*  }*/
  /*}*/
</style>

<style lang="scss">
  .page {
    &__link {
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;

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
