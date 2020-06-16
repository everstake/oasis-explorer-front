<template>
  <div class="transactions-list">
    <div class="transactions-list__filter" v-if="filters">
      <div class="transactions-list__title">Operations filters</div>
      <div class="transactions-list__container">
        <date-range-picker
          class="transactions-list__calendar"
          ref="picker"
          v-model="dateRange"
          :ranges="false"
          :opens="'right'"
          :min-date="getMinCalendarDate"
          :max-date="new Date()"
          :locale-data="getLocaleData"
          :key="getLocaleData.format"
          @update="handleCalendarUpdate"
        >
          <div class="transactions-list__label" slot="input">
            Select date
            <font-awesome-icon class="transactions-list__icon" icon="calendar-check" />
          </div>
        </date-range-picker>
        <div class="transactions-dropdown">
          <b-dropdown id="dropdown-1" text="Select type" class="m-md-2">
            <b-dropdown-form
              class="transactions-dropdown__content"
              :disabled="dropdownIsBusy"
              :class="{
                'transactions-dropdown--disabled': dropdownIsBusy
              }"
            >
              <b-form-checkbox
                :disabled="operations.length === 1 && operations[0] === 'transactions'"
                v-model="operations"
                value="transactions"
                class="mb-3"
              >
                Transactions
              </b-form-checkbox>

              <b-form-checkbox
                :disabled="operations.length === 1 && operations[0] === 'escrow/unbonding'"
                v-model="operations"
                value="escrow/unbonding"
                class="mb-3"
              >

                Escrow/Unbonding
              </b-form-checkbox>

              <b-form-checkbox
                :disabled="operations.length === 1 && operations[0] === 'burn'"
                v-model="operations"
                value="burn"
                class="mb-3"
              >
                Burn
              </b-form-checkbox>

              <b-form-checkbox
                :disabled="operations.length === 1 && operations[0] === 'other'"
                v-model="operations"
                value="other"
              >
                Other
              </b-form-checkbox>
            </b-dropdown-form>
          </b-dropdown>
        </div>
      </div>
    </div>
    <b-table
      ref="table"
      :busy="loading && data === null"
      :responsive="true"
      show-empty
      :fields="fields"
      :items="data"
      class="table table--border transactions-list__table"
      :class="{
        'transactions-list__table--disabled': dropdownIsBusy
      }"
      :disabled="dropdownIsBusy"
      borderless
      no-border-collapse
      @row-selected="handleRowClick"
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(level)="data">
        <router-link
          :to="{ name: 'block', params: { id: data.item.level } }"
        >
          {{ data.item.level }}
        </router-link>
      </template>
      <template #cell(hash)="data">
        <router-link
          :to="{ name: 'transaction', params: { id: data.item.hash } }"
          :class="{
            'table__hash': minifyTableHash
          }"
        >
          {{ data.item.hash }}
        </router-link>
      </template>
      <template #cell(from)="items">
        <span v-if="!items.item.from">-</span>
        <router-link
          v-else
          :to="{ name: 'account', params: { id: items.item.from } }"
        >
          {{ items.item.from }}
        </router-link>
      </template>
      <template #cell(to)="data">
        {{ data.item.to === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
        ? 'System Account' : !data.item.to ? '-' : data.item.to }}
      </template>
      <template #cell(fees)="data">
        {{ !data.item.fees ? '-' : data.item.fees }}
      </template>
      <template #cell(amount)="data">
        {{ !data.item.amount ? '-' : data.item.amount }}
      </template>
      <template #cell(timestamp)="items">
        {{ items.item.timestamp | formatDate }}
        <div class="date-from-now">
          {{ items.item.timestamp | formatDaysAgo }}
        </div>
      </template>
    </b-table>
    <div
      v-if="scrollToLoadMore && data !== null"
      class="blocks-list__actions"
    >
      <b-button
        @click="onShowMore"
        variant="outline-primary"
        class="blocks-list__button font-weight-bold"
        :class="{
          'blocks-list__button--loading': loading
        }"
        :disabled="loading"
      >
        <span v-if="error">
          Something went wrong, click to retry
        </span>
        <span v-else-if="loading" disabled>
          Loading
          <font-awesome-icon class="blocks-list__icon" icon="sync-alt" :spin="loading" />
        </span>
        <span v-else>
          Show more
          <font-awesome-icon class="blocks-list__icon" icon="arrow-circle-down" :spin="loading" />
        </span>
      </b-button>
    </div>
  </div>
</template>

<script>
import TableLoader from '@/components/TableLoader.vue';
import debounce from 'lodash/debounce';
import DateRangePicker from 'vue2-daterange-picker';
import { mapState } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'OperationsList',
  components: {
    TableLoader,
    DateRangePicker,
  },
  props: {
    rows: {
      type: Number,
      default: null,
    },
    scrollToLoadMore: {
      type: Boolean,
      default: true,
    },
    fields: {
      type: Array,
      default() {
        return [
          { key: 'level', label: 'Height', sortable: true },
          { key: 'hash', label: 'Operation Hash' },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'amount', label: 'Amount', sortable: true },
          { key: 'nonce', label: 'Nonce' },
          { key: 'type', label: 'Type' },
          { key: 'timestamp', label: 'Date', sortable: true },
        ];
      },
    },
    minifyTableHash: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: null,
      loading: null,
      limit: 50,
      offset: 0,
      error: false,
      dateRange: {
        startDate: null,
        endDate: null,
      },
      operations: ['transactions'],
      dropdownIsBusy: false,
    };
  },
  watch: {
    operations: {
      deep: true,
      handler() {
        this.dropdownIsBusy = true;

        setTimeout(() => {
          this.dropdownIsBusy = false;
        }, 800);
      },
    },
  },
  methods: {
    async handleCalendarUpdate(val) {
      const from = +val.startDate / 1000;
      const to = +val.endDate / 1000;

      const data = await this.fetchData({ from, to });

      if (data.status !== 200) {
        this.error = true;
      } else {
        this.error = false;
        this.offset = 0;
        this.data = data.data;
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    handleScroll() {
      if (window.scrollY > this.$refs.table.$el.getBoundingClientRect().height) {
        this.onShowMore();
      }
    },
    handleRowClick(item) {
      const { hash } = item[0];

      this.$router.push({
        name: 'transaction',
        params: { hash },
      });
    },
    fetchData(params = {}) {
      return this.$api.getTransactions({ ...params, limit: this.getTransactionsLimit });
    },
    async onShowMore() {
      let data;
      this.loading = true;
      this.offset += 50;

      const isDateReady = this.dateRange.startDate && this.dateRange.endDate;

      if (isDateReady) {
        const from = +this.dateRange.startDate / 1000;
        const to = this.dateRange.endDate / 1000;
        data = await this.fetchData({ offset: this.offset, from, to });
      } else {
        data = await this.fetchData({ offset: this.offset });
      }

      if (data.status !== 200) {
        this.error = true;
      } else {
        this.error = false;
        this.data = [
          ...this.data,
          ...data.data,
        ];
      }

      this.loading = false;
    },
    setEventListenerOnScroll() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 100);
      window.addEventListener('scroll', this.handleDebouncedScroll);
    },
    removeEventListenerOnScroll() {
      window.removeEventListener('scroll', this.handleDebouncedScroll);
    },
  },
  computed: {
    ...mapState(['dateFormat']),
    getMinCalendarDate() {
      const now = new Date();

      return dayjs(now.setFullYear(now.getFullYear() - 3)).$d;
    },
    getTransactionsLimit() {
      return this.rows || this.limit;
    },
    getLocaleData() {
      if (this.dateFormat === this.$constants.DATE_FORMAT_US) {
        return {
          format: 'mm/dd/yyyy',
        };
      }

      return {
        format: 'dd/mm/yyyy',
      };
    },
  },
  async created() {
    this.loading = true;
    const data = await this.fetchData();
    this.data = data.data;
    this.loading = false;

    if (this.scrollToLoadMore) {
      this.setEventListenerOnScroll();
    }
  },
  beforeDestroy() {
    if (this.scrollToLoadMore) {
      this.removeEventListenerOnScroll();
    }
  },
};
</script>

<style lang="scss">
  .transactions-list {
    &__actions {
      margin-top: 50px;
      margin-bottom: 50px;
    }

    &__button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: auto;

      &:hover,
      &:active {
        color: $color-white !important;
      }

      &--loading {
        color: $color-primary;
        background: $color-white;
        box-shadow: none;
        border: 1px solid transparent;

        &:hover,
        &:focus {
          color: $color-primary !important;
          background: $color-white;
          outline: none;
          box-shadow: none;
        }
      }
    }

    &__icon {
      margin-left: 10px;
    }

    & .date-from-now {
      font-size: 14px;
      color: #999;
    }

    &__filter {
      margin-bottom: 10px;
      font-family: $open-sans;
      font-size: 16px;
    }

    &__container {
      display: flex;
      align-items: center;
    }

    &__title {
      font-size: 16px;
      font-family: $open-sans;
    }

    &__calendar {
      text-align: center;
      background-color: $color-primary;
      border-radius: 4px;
    }

    &__label {
      font-size: 15px;
      font-weight: bold;
      color: #fff;
    }

    &__icon {
      margin-left: 5px;
    }

    &__table {
      position: relative;

      &--disabled {
        & a {
          pointer-events: none;
        }

        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: block;
          background-color: $color-primary-transparent-01;
        }
      }
    }
  }
</style>

<style lang="scss">
  .transactions-dropdown {

    &__content {
      font-size: 15px;

      & form:focus {
        outline: none !important;
      }
    }

    & .btn-secondary {
      display: flex;
      align-items: center;
      font-size: 15px;
      background-color: $color-primary !important;
      border-color: $color-primary !important;
      font-weight: bold;
      border-radius: 4px;
    }

    &--disabled:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: block;
      background-color: $color-primary-transparent-01;
      pointer-events: none;
    }
  }
</style>
