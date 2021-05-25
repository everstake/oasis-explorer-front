<template>
  <div class="table-status">
    <div
      v-if="loading"
      class="table-status__loading"
    >
      <font-awesome-icon
        size="2x"
        icon="spinner"
        spin
      />
    </div>

    <div
      v-if="error"
      class="table-status__error"
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
  &__loading {
    color: $color-primary
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 4px;

    width: max-content;
    padding: 8px;

    border-radius: 8px;
    background-color: $color-primary;
    color: $color-white;

    cursor: pointer;
  }
}
</style>
