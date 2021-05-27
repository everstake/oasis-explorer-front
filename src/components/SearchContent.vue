<template>
  <div class="search__content">
    <b-container fluid="lg">
      <b-row class="search__row">
        <p class="search__title">
          Oasis Monitor
        </p>
        <p class="search__subtitle">
          Search by block height, account or operation
        </p>
        <div class="search__controls">
          <label
            class="search__label"
            for="input"
          >
            <font-awesome-icon
              class="icon search__icon"
              :icon="['fas', 'search']"
            />
          </label>
          <input
            v-if="search.completed"
            id="input"
            :value="search.query"
            class="search__input"
            type="text"
            placeholder="Enter block height, account or operation"
            aria-label="Search"
          >
          <input
            v-else-if="autofocus"
            id="input"
            v-model="query"
            v-autofocus
            class="search__input"
            type="text"
            placeholder="Enter block height, account or operation"
            aria-label="Search"
            @keypress.enter.prevent="$emit('handleSubmit', query)"
          >
          <input
            v-else
            id="input"
            v-model="query"
            class="search__input"
            type="text"
            placeholder="Enter block height, account or operation"
            aria-label="Search"
            @keypress.enter.prevent="$emit('handleSubmit', query)"
          >
          <button
            class="search__submit"
            @click="$emit('handleSubmit', query)"
          >
            <font-awesome-icon
              v-if="loading"
              icon="spinner"
              spin
            />
            <span v-else>Search</span>
          </button>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'SearchContent',
  directives: {
    autofocus: {
      inserted(el) {
        el.focus();
      },
    },
  },
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Object,
      default() {
        return {
          completed: false,
          query: '',
        };
      },
    },
  },
  data() {
    return {
      query: '',
    };
  },
};
</script>
