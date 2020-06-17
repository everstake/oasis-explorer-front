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
      this.loading = false;
      this.isSearchActive = false;
      document.body.className = '';
    },
    async handleSubmit(query) {
      this.loading = true;
      const queryString = query.trim();
      const isQueryNumber = !Number.isNaN(Number(queryString));
      const options = {};
      let data;

      // eslint-disable-next-line eqeqeq
      if (this.$route.params.id == queryString) {
        this.hideSearch();
        return;
      }

      if (isQueryNumber) {
        data = await this.$api.getBlocks({ block_level: Number(queryString) });
        options.id = Number(queryString);
      } else {
        data = await this.$api.getBlocks({ block_id: queryString });
        options.id = queryString;
      }

      this.loading = false;

      if (data.status !== 200 || data.data.length === 0) {
        this.$notify({
          type: 'error',
          title: 'Oasis Monitor',
          text: 'Block not found',
        });
        return;
      }

      this.$router.push({ name: 'block', params: { ...options } }).catch(() => {});
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
      document.title = 'Search | Oasis Monitor';
    } else {
      document.title = this.$route.meta.title;
    }
  },
};
</script>
