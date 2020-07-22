<template>
  <div class="search">
    <div
      v-if="!isSearchVisible"
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
          class="search-content search--height-100-vh"
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
      isSearchVisible: false,
      loading: null,
      validators: null,
    };
  },
  methods: {
    showSearch() {
      this.isSearchVisible = true;
      document.body.className = 'scroll-disabled';
    },
    checkIsQueryNumber(queryString) {
      return !Number.isNaN(Number(queryString));
    },
    checkIsQueryAnAccount(queryString) {
      return queryString.slice(0, 5) === 'oasis';
    },
    checkIsQueryValidator(queryString) {
      this.validators.find(({ account_id: id, account_name: name }) => {
        const isMatchComplete = queryString === id || queryString === name;
        const isMatchPartically = name.toLowerCase().indexOf(queryString.toLowerCase());

        if (isMatchComplete || isMatchPartically >= 0) {
          return id;
        }
      });
    },
    hideSearch() {
      this.loading = false;
      this.isSearchVisible = false;
      document.body.className = '';
    },
    async handleSubmit(input) {
      /* eslint-disable */
      if (input === '') {
        return false;
      }

      this.loading = true;
      const queryString = input.trim();

      const isQueryNumber = this.checkIsQueryNumber(queryString);
      const isQueryAnAccount = this.checkIsQueryAnAccount(queryString);
      const isQueryValidator = this.checkIsQueryValidator(queryString);

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
      } else if (isQueryValidator) {
        data = await this.$api.getValidator({ id: isQueryValidator.account_id });
        options.id = isQueryValidator.account_id;
      } else if (isQueryAnAccount) {
        try {
          data = await this.$api.getValidator({ id: isQueryValidator.account_id });
          options.id = isQueryValidator.account_id;
          return;
        } catch {
          data = await this.$api.getAccount({ id: queryString });
          options.id = queryString;
        }
      } else if (queryString.length === 64) {
        data = await this.$api.getTransactions({ operation_id: queryString });
        options.id = queryString;
      }

      this.loading = false;
      
      if (data.status !== 200 || data.data.length === 0) {
        this.$notify({
          type: 'error',
          title: 'Oasis Monitor',
          text: 'Oops, wrong input',
        });
        return;
      }

      if (isQueryNumber) {
        this.$router.push({ name: 'block', params: { ...options } }).catch(() => {});
      } else if (isQueryValidator) {
        this.$router.push({ name: 'validator', params: { ...options } }).catch(() => {});
      } else if (isQueryAnAccount) {
        this.$router.push({ name: 'account', params: { ...options } }).catch(() => {});
      } else if (queryString.length === 64) {
        this.$router.push({ name: 'operation', params: { ...options } }).catch(() => {});
      }
    },
    async fetchValidatorsList() {
      const validators = await this.$api.getValidatorsList();

      this.validators = validators.data;
    },
  },
  watch: {
    $route() {
      this.hideSearch();
    },
  },
  updated() {
    if (this.validators === null) {
      this.fetchValidatorsList();
    }
    if (this.isSearchVisible) {
      document.title = 'Search | Oasis Monitor';
    } else {
      document.title = this.$route.meta.title;
    }
  },
};
</script>
