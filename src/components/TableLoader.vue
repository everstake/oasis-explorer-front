<template>
  <div class="table__loader text-center">
    <b-spinner class="table__spinner align-middle"></b-spinner>
  </div>
</template>

<script>
export default {
  name: 'TableLoader',
};
</script>

<style lang="scss">
  .table {
    &__loader {
      font-size: 18px;
      font-weight: 400;
      padding: 20px 0;
      color: $color-primary;
    }
  }
</style>
