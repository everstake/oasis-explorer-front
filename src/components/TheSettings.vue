<template>
  <div class="settings">
    <div
      v-if="!isSettingsActive"
       @click="showSearch()"
      class="settings__icon"
    >
      <font-awesome-icon class="icon settings__icon" :icon="['fas', 'cog']" />
    </div>
    <div
        v-else
        class="settings__form"
      >
        <div
          @click="hideSearch()"
          class="settings__close"
        >
          <font-awesome-icon class="icon social__icon" :icon="['fas', 'times']" />
        </div>
        <SettingsContent
          :loading="loading"
          :autofocus="true"
          @handleSubmit="handleSubmit"
          class="settings--height-100-vh"
        />
    </div>
  </div>
</template>

<script>
import SettingsContent from './SettingsContent.vue';

export default {
  name: 'TheSettings',
  components: {
    SettingsContent,
  },
  data() {
    return {
      query: '',
      error: null,
      isSettingsActive: false,
      loading: null,
    };
  },
  methods: {
    showSearch() {
      this.isSettingsActive = true;
      document.body.className = 'scroll-disabled';
    },
    hideSearch() {
      this.isSettingsActive = false;
      document.body.className = '';
    },
    async handleSubmit(props) {
      this.loading = true;
      if (props.subscribe) localStorage.setItem('subscribe', props.subscribe);
      if (props.email) localStorage.setItem('email', props.email);
      if (props.name) localStorage.setItem('name', props.name);
      setTimeout(() => {
        this.loading = false;
      }, 200);
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
    if (this.isSettingsActive) {
      document.title = 'Settings | Oasis Monitor';
    } else {
      document.title = this.$route.meta.title;
    }
  },
};
</script>
