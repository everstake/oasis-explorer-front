<template>
  <div
    class="common-table"
    :style="{ maxHeight, height }"
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

    <div
      v-show="loading || error"
      :class="['common-table__status-wrapper', {
        'common-table__status-wrapper--empty-table': items.length === 0,
      }]"
    >
      <TableStatus
        :loading="loading"
        :error="error"
        @click="fetch"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import api from '@/services/api.service';
import {
  DEFAULT_LIMIT,
  START_OFFSET,
  DEFAULT_HEIGHT,
} from '@/components/CommonTable/constants';
import TableStatus from './TableStatus.vue';

export default {
  name: 'CommonTable',
  components: { TableStatus },
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
    height: {
      type: String,
      required: false,
      default: DEFAULT_HEIGHT,
    },
    maxHeight: {
      type: String,
      required: false,
      default: DEFAULT_HEIGHT,
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
      offset: START_OFFSET,
    };
  },
  watch: {
    fetchParams: {
      immediate: true,
      handler() {
        this.items = [];
        this.fetch();
      },
    },
  },
  created() {
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

      const limit = this.fetchParams.limit || DEFAULT_LIMIT;
      const offset = concat ? this.offset + limit : START_OFFSET;

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
        console.error(e);
      } finally {
        this.loading = false;
      }
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
  position: relative;
  display: flex;
  flex-direction: column;

  font-family: $open-sans;
  font-size: 16px;

  &__table-wrapper {
    margin: 0;
    padding-bottom: 4px;
  }

  &__status-wrapper {
    position: absolute;
    display: flex;
    justify-content: center;

    padding: 32px 0;

    bottom: 12px;
    left: 0;
    right: 0;

    &--empty-table {
      position: static;
    }
  }

  [aria-busy="true"] {
    tbody {
      opacity: 0.3;
    }
  }

  th {
    color: $color-white;
    background: $color-primary;

    &:first-child {
      border-top-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
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

  &__format-days-ago {
    font-size: 14px;
    color: #999;
  }
}
</style>
