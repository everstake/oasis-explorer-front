<template>
  <div class="top-line">
    <TheLogotype />
    <div class="top-line-right">
      <div class="top-line__item search">
        <TheSearch />
      </div>
      <b-nav-item-dropdown class="top-line__item network-selection">
        <template slot="button-content">
          <font-awesome-icon
            icon="network-wired"
            class="icon"
          />
          {{ isMainnet ? 'Mainnet' : 'Testnet' }}
        </template>
        <b-dropdown-item
          active-class="top-line__active"
          :href="isMainnet ? $constants.TESTNET_URL : $constants.MAINNET_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
          <font-awesome-icon
            icon="network-wired"
            class="icon"
          />
          {{ isMainnet ? 'Testnet' : 'Mainnet' }}
        </b-dropdown-item>
      </b-nav-item-dropdown>
      <div class="top-line__item language">
        <b-nav-item-dropdown class="language-selection">
          <template slot="button-content">
            <font-awesome-icon
              icon="flag"
              class="icon"
            />
            En
          </template>
          <b-dropdown-item disabled>
            <font-awesome-icon
              icon="flag"
              class="icon"
            />
            Ru
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
      <div class="settings">
        <TheSettings />
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
  data() {
    return {
      isMainnet: true,
    };
  },
  created() {
    const {
      $constants: {
        NETWORK_TYPE,
        NETWORK_TYPES,
      },
    } = this;

    this.isMainnet = NETWORK_TYPE === NETWORK_TYPES.mainnet;
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
  flex-wrap: wrap;
}

.logo {
  &__img {
    width: 300px;

    @media (max-width: 480px) {
      max-width: none;
      width: 100%;
    }
  }
}

.network-selection,
.language {
  list-style: none;
}

.network-selection,
.language-selection {
  & > a {
    color: #999;
    @extend .animations__default;

    &:hover {
      color: $color-primary;
      @extend .animations__default--hover;
    }
  }

  &.show {
    & > a {
      color: $color-primary;
      @extend .animations__default;

      &:hover {
        color: $color-primary;
        @extend .animations__default--hover;
      }
    }
  }
}

.settings {
  &__icon {
    font-size: 20px;
    color: $color-gray-999;
  }
}
</style>
