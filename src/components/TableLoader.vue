<template>
  <div class="table-loader">
    <font-awesome-icon
      class="table-loader__sppiner"
      size="2x"
      icon="spinner"
      spin
    />
  </div>
</template>

<script>
export default {
  name: 'TableLoader',
};
</script>

<style lang="scss" scoped>
.table-loader {
  display: flex;
  justify-content: center;
  padding: 20px 0;

  &__sppiner {
    color: $color-primary;
  }
}
</style>
