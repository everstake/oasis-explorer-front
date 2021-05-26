<template>
  <span
    :class="['status-icon', {
      'status-icon--active': status,
      'status-icon--inactive': !status
    }]"
  >
    <font-awesome-icon
      v-if="status"
      size="1x"
      icon="check-circle"
    />
    <font-awesome-icon
      v-else
      size="1x"
      icon="times-circle"
    />
  </span>
</template>

<script>
export default {
  name: 'StatusIcon',
  props: {
    status: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.status-icon {
  &--active {
    color: #28a745;
  }

  &--inactive {
    color: #dc3545;
  }
}
</style>
