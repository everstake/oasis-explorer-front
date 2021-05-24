<template>
  <div class="table-status">
    <div
      v-if="loading"
      class="table-status__inner"
    >
      Loading
      <font-awesome-icon
        size="1x"
        icon="spinner"
        spin
      />
    </div>

    <div
      v-if="error"
      class="table-status__inner table-status__inner--pointer"
      @click="$emit('click')"
    >
      Something went wrong, try again
      <font-awesome-icon
        size="1x"
        icon="sync"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    error: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.table-status {
  width: max-content;
  padding: 8px;

  border-radius: 8px;
  background-color: $color-primary;
  color: $color-white;

  &__inner {
    display: flex;
    align-items: center;
    gap: 4px;

    &--pointer {
      cursor: pointer;
    }
  }
}
</style>
