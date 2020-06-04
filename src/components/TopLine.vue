<template>
  <div class="top-line">
    <TheLogotype />
    <div class="top-line-right">
      <div class="top-line__item search">
        <TheSearch />
      </div>
      <b-nav-item-dropdown
        class="top-line__item network-selection"
      >
        <template slot="button-content">
          <font-awesome-icon icon="network-wired" class="icon" />
          Testnet
        </template>
        <b-dropdown-item disabled active-class="top-line__active">
          <font-awesome-icon icon="network-wired" class="icon" />
          Mainnet
        </b-dropdown-item>
      </b-nav-item-dropdown>
      <div class="top-line__item language">
        <b-nav-item-dropdown>
          <template slot="button-content">
            <font-awesome-icon icon="flag" class="icon" />
            En
          </template>
          <b-dropdown-item disabled>
            <font-awesome-icon icon="flag" class="icon" />
            Ru
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
      <div class="settings">
        <TheSettings />
<!--        <font-awesome-icon  class="icon settings__icon" :icon="['fas', 'cog']" />-->
      </div>
    </div>
  </div>
</template>

<script>
import TheLogotype from '@/components/TheLogotype.vue';
import TheSearch from '@/components/TheSearch.vue';
import TheSettings from '@/components/TheSettings.vue';

export default {
  name: 'TopLine',
  components: {
    TheSearch,
    TheSettings,
    TheLogotype,
  },
};
</script>

<style lang="scss">
  .top-line {
    padding: 20px 0;

    &__item {
      margin: 0 5px;

      &:last-child {
        margin-right: 0;
      }
    }

    &__active {
      color: $color-white;
      background-color: $color-primary;
    }
  }

  .top-line,
  .top-line-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    &__img {
      width: 150px;
    }
  }

  .network-selection,
  .language {
    list-style: none;
  }

  .settings {
    &__icon {
      font-size: 20px;
      color: $color-gray-999;
    }
  }
</style>
