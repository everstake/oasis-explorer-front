<template>
  <b-breadcrumb class="breadcrumbs">
    <b-container class="breadcrumbs__container">
      <b-breadcrumb-item
        v-for="(crumb, index) in crumbs"
        :key="index"
        :to="{ name: crumb.toRouteName, params: { ...crumb.params } }"
        :tag="index === crumbs.length - 1 ? 'span' : 'a'"
        :active="index === crumbs.length - 1"
        class="breadcrumbs__item"
      >
        {{ crumb.text }}
      </b-breadcrumb-item>
    </b-container>
  </b-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    crumbs: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
  .breadcrumbs {
    &__container {
      display: flex;

      @include from-768-down {
        flex-wrap: wrap;
      }
    }

    &__item {
      &.active {
        @include from-768-down {
          max-width: 200px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }

      &.active span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
</style>
