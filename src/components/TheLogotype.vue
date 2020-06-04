<template>
  <div class="logo">
    <router-link :to="{ name: 'home' }">
     <img class="logo__img" src="../assets/images/logo.svg" alt="Oasis logotype">
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'TheLogotype',
};
</script>
