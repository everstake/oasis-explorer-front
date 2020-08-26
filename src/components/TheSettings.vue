<template>
  <div class="settings">
    <div
      v-if="!isSettingsVisible"
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
      isSettingsVisible: false,
      loading: null,
    };
  },
  methods: {
    showSearch() {
      this.isSettingsVisible = true;
      document.body.className = 'scroll-disabled';
    },
    hideSearch() {
      this.isSettingsVisible = false;
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
  },
  watch: {
    $route() {
      this.hideSearch();
    },
  },
  updated() {
    if (this.isSettingsVisible) {
      document.title = 'Settings | Oasis Monitor';
    } else {
      document.title = this.$route.meta.title;
    }
  },
};
</script>
