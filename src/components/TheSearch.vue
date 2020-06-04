<template>
  <div class="search">
    <div
      v-if="!isSearchActive"
       @click="showSearch()"
      class="search__icon"
    >
      <font-awesome-icon class="icon search__icon" :icon="['fas', 'search']" />
    </div>
    <div
        v-else
        class="search__form"
      >
        <div
          @click="hideSearch()"
          class="search__close"
        >
          <font-awesome-icon class="icon social__icon" :icon="['fas', 'times']" />
        </div>
        <SearchContent
          :loading="loading"
          :autofocus="true"
          @handleSubmit="handleSubmit"
          class="search--height-100-vh"
        />
    </div>
  </div>
</template>

<script>
import SearchContent from './SearchContent.vue';

export default {
  wname: 'TheSearch',
  components: {
    SearchContent,
  },
  data() {
    return {
      query: '',
      error: null,
      isSearchActive: false,
      loading: null,
    };
  },
  methods: {
    showSearch() {
      this.isSearchActive = true;
      document.body.className = 'scroll-disabled';
    },
    hideSearch() {
      this.isSearchActive = false;
      document.body.className = '';
    },
    async handleSubmit(query) {
      this.loading = true;

      console.log(query);

      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    validateForm(query) {
      this.error = null;

      if (query === '') {
        this.error = 'Search string should not be empty.';
        return false;
      }

      return true;
    },
  },
  watch: {
    $route() {
      this.hideSearch();
    },
  },
  updated() {
    if (this.isSearchActive) {
      document.title = 'Search | Oasis Explorer';
    } else {
      document.title = this.$route.meta.title;
    }
  },
};
</script>
