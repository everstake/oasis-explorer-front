<template>
  <div class="search__content">
    <b-container>
      <b-row class="search__row">
        <p class="search__title">Oasis Explorer</p>
        <p class="search__subtitle">Settings</p>
        <div class="search__controls search__controls--inline">
          <b-form @submit="onSubmit">
            <b-form-group id="input-group-2" label="Your Name" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="name"
                required
                placeholder="Enter name"
                @input="isFormSaved = false"
              ></b-form-input>
            </b-form-group>
            <b-form-group
                id="input-group-1"
                label="Email address"
                label-for="input-1"
                description="We'll never share your email with anyone else."
                class="mt-4"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter email"
                  @input="isFormSaved = false"
                ></b-form-input>
              </b-form-group>
            <b-button
              type="submit"
              variant="outline-primary"
              class="font-weight-bold button button--outline"
              :class="{
                'transactions-list__button--loading': loading
              }"
              :disabled="loading"
            >
              <span v-if="loading" disabled>
                Saving
                <font-awesome-icon class="blocks-list__icon" icon="sync-alt" :spin="loading" />
              </span>
              <span
                v-else-if="!loading && isFormSaved"
              >
                Saved
                <font-awesome-icon class="blocks-list__icon" icon="check-circle" />
              </span>
              <span v-else>
                Save
              </span>
            </b-button>
          </b-form>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'SettingsContent',
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
      default: null,
    },
  },
  data() {
    return {
      email: null,
      name: null,
      isFormSaved: false,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      const { email, name } = this;
      this.$emit('handleSubmit', { email, name });
      this.isFormSaved = true;
    },
  },
  created() {
    if (localStorage.getItem('email') !== null) {
      this.email = localStorage.getItem('email');
    }

    if (localStorage.getItem('name') !== null) {
      this.name = localStorage.getItem('name');
    }
  },
};
</script>

<style lang="scss">
  .settings {
    &__button {}
  }
</style>
