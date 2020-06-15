<template>
  <div class="search__content">
    <b-container>
      <b-row class="search__row">
        <p class="search__title">Oasis Monitor</p>
        <p class="search__subtitle">Settings</p>
        <div class="search__controls search__controls--inline">
          <b-form>
            <b-form-group label="Date format">
              <b-form-radio v-model="dateFormat" name="standart" value="standart">
                Standart format
              </b-form-radio>
              <b-form-radio v-model="dateFormat" name="us" value="us">
                US format
              </b-form-radio>
            </b-form-group>
          </b-form>

          <b-form @submit="onSubmit">
            <b-form-group id="input-group-2" label="Your Name" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="name"
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
            <b-form-group id="input-group-4">
              <b-form-checkbox v-model="subscribe">Subscribe to our newsletter</b-form-checkbox>
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
import { mapMutations } from 'vuex';

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
      subscribe: null,
      dateFormat: null,
    };
  },
  watch: {
    dateFormat: {
      immediate: true,
      handler(val) {
        if (val === 'standart') {
          localStorage.setItem('dateFormat', this.$constants.DATE_FORMAT);
          this.setDateFormat(this.$constants.DATE_FORMAT);
          return;
        }

        if (val === 'us') {
          localStorage.setItem('dateFormat', this.$constants.DATE_FORMAT_US);
          this.setDateFormat(this.$constants.DATE_FORMAT_US);
        }
      },
    },
  },
  methods: {
    ...mapMutations(['setDateFormat']),
    onSubmit(event) {
      event.preventDefault();
      const { email, name, subscribe } = this;
      this.$emit('handleSubmit', { email, name, subscribe });
      this.isFormSaved = true;
    },
  },
  created() {
    const isDateFormatAvailable = localStorage.getItem('dateFormat');

    if (isDateFormatAvailable) {
      if (isDateFormatAvailable === this.$constants.DATE_FORMAT_US) {
        this.dateFormat = 'us';
        this.setDateFormat(this.$constants.DATE_FORMAT_US);
      } else {
        this.dateFormat = 'standart';
        this.setDateFormat(this.$constants.DATE_FORMAT);
      }
    }

    if (localStorage.getItem('email') !== null) {
      this.email = localStorage.getItem('email');
    }

    if (localStorage.getItem('name') !== null) {
      this.name = localStorage.getItem('name');
    }

    if (localStorage.getItem('subscribe') !== null) {
      this.subscribe = localStorage.getItem('subscribe');
    }
  },
};
</script>

<style lang="scss">
  .settings {
    &__button {}
  }
</style>
