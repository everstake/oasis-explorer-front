<template>
  <div
    class="common-table"
    :style="{ maxHeight }"
  >
    <b-table
      ref="table"
      class="common-table__table-wrapper"

      :fields="fields"
      :items="items"
      :busy="loading"
      :head-variant="headVariant"
      :show-empty="!loading && items.length === 0"
      :no-local-sorting="!hasTableAllData"

      sticky-header="100%"

      responsive
      borderless
      no-border-collapse
      no-sort-reset

      @sort-changed="fetchSorted"
    >
      <template
        v-for="key in Object.keys($scopedSlots)"
        #[key]="{ item, index}"
      >
        <slot
          :name="key"
          :item="item"
          :index="index"
        />
      </template>
    </b-table>

    <div class="common-table__table-status">
      <div v-if="loading">
        Loading
        <font-awesome-icon
          size="1x"
          icon="spinner"
          spin
        />
      </div>
      <div
        v-if="error"
        class="common-table__try-again"
        @click="fetch"
      >
        Something went wrong, try again
        <font-awesome-icon
          size="1x"
          icon="sync"
        />
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import api from '@/services/api.service';

export default {
  name: 'CommonTable',
  props: {
    fields: {
      type: Array,
      required: true,
    },
    requestName: {
      type: String,
      required: true,
      validator(value) {
        return Object.keys(api).includes(value);
      },
    },
    fetchParams: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isFetchOnScrollEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    maxHeight: {
      type: String,
      required: false,
      default: '80vh',
    },
    headVariant: {
      type: String,
      required: false,
      default: 'custom',
    },
  },
  data() {
    return {
      items: [],
      loading: false,
      error: false,
      hasTableAllData: false,
      offset: 0,
    };
  },
  watch: {
    fetchParams() {
      this.items = [];
      this.fetch();
    },
  },
  created() {
    this.fetch();
    this.onScroll = debounce(this.onScroll, 100);
  },
  mounted() {
    if (this.isFetchOnScrollEnabled) {
      this.$refs.table.$el.addEventListener('scroll', this.onScroll);
    }
  },
  beforeDestroy() {
    if (this.isFetchOnScrollEnabled) {
      this.$refs.table.$el.removeEventListener('scroll', this.onScroll);
    }
  },
  methods: {
    async fetch(options = {}) {
      this.error = false;
      this.loading = true;

      const {
        params = {},
        concat = false,
      } = options;

      const limit = this.fetchParams.limit || 50;
      const offset = concat ? this.offset + limit : 0;

      try {
        const response = await this.$api[this.requestName]({
          limit,
          offset,
          ...this.fetchParams,
          ...params,
        });

        if (response.status !== 200) {
          throw new Error(response);
        }

        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        this.items = concat ? [...this.items, ...data] : data;
        this.offset = offset;
        this.hasTableAllData = data.length < limit;
      } catch (e) {
        this.error = true;
      }

      this.loading = false;
    },
    fetchSorted({ sortBy, sortDesc }) {
      const params = {
        sort_column: sortBy,
        sort_side: sortDesc ? 'desc' : 'asc',
      };

      this.fetch({ params });
    },
    onScroll() {
      if (this.loading || this.hasTableAllData) {
        return;
      }

      const {
        bottom: tableContainerBottom,
      } = this.$refs.table.$el.getBoundingClientRect();

      const {
        bottom: tableBottom,
      } = this.$refs.table.$el.children[0].getBoundingClientRect();

      if (tableContainerBottom > tableBottom) {
        this.fetch({ concat: true });
      }
    },
  },
};
</script>

<style lang="scss">
.common-table {
  display: flex;
  flex-direction: column;

  padding-bottom: 16px;

  font-family: $open-sans;
  font-size: 16px;

  &__table-wrapper {
    padding-bottom: 4px;
  }

  &__table-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    flex-shrink: 0;
    height: 24px;

    color: $color-primary;
  }

  &__try-again {
    cursor: pointer;
  }

  th {
    color: $color-white;
    background: $color-primary;

    &:first-child {
      border-top-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
    }
  }

  .cell-center {
    text-align: center;
  }

  $cells: (
    'xs': 80px,
    's': 100px,
    'm': 120px,
    'l': 160px,
    'xl': 180px,
    'xxl': 200px,
  );

  @each $name, $size in $cells {
    .cell-#{$name} {
      max-width: $size;
    }

    .cell-#{$name}-center {
      max-width: $size;
      text-align: center;
    }
  }

  &__status {
    display: flex;
    justify-content: center;
    align-items: center;

    &--active {
      color: #28a745;
    }

    &--inactive {
      color: #dc3545;
    }
  }

  &__format-days-ago {
    font-size: 14px;
    color: #999;
  }
}
</style>
