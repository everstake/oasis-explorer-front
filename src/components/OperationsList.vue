<template>
  <div class="transactions-list">
    <div class="transactions-list__filter" v-if="filters">
      <div class="transactions-list__title">Operations filters</div>
      <div class="transactions-list__container">
        <div class="transactions-list__reset">
          <b-btn @click="clearFilters" class="transactions-list__btn">
            <font-awesome-icon icon="sync" :spin="dropdownIsBusy" />
          </b-btn>
        </div>
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
          <template v-slot:input="picker" style="min-width: 350px;">
            <div class="transactions-list__label" slot="input">
              Select date
              <font-awesome-icon
                class="transactions-list__icon"
                icon="calendar-check"
              />
            </div>
            <span
              class="transactions-list__date"
              v-if="dateRange.startDate && dateRange.endDate"
            >
              {{ formatDate(picker.startDate) }} -
              {{ formatDate(picker.endDate) }}
            </span>
          </template>
        </date-range-picker>
        <div class="transactions-dropdown">
          <b-dropdown id="dropdown-1" text="Select type">
            <b-dropdown-form
              class="transactions-dropdown__content"
              :disabled="dropdownIsBusy"
              :class="{
                'transactions-dropdown--disabled': dropdownIsBusy,
              }"
            >
              <b-form-checkbox
                :disabled="
                  operations.length === 1 && operations[0] === 'transfer'
                "
                v-model="operations"
                value="transfer"
                class="mb-3"
              >
                Transfers
              </b-form-checkbox>

              <b-form-checkbox
                :disabled="
                  operations.length === 1 && operations[0] === 'addescrow'
                "
                v-model="operations"
                value="addescrow"
                class="mb-3"
              >
                Addescrow
              </b-form-checkbox>

              <b-form-checkbox
                :disabled="
                  operations.length === 1 && operations[0] === 'reclaimescrow'
                "
                v-model="operations"
                value="reclaimescrow"
                class="mb-3"
              >
                Reclaimescrow
              </b-form-checkbox>

              <b-form-checkbox
                disabled
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
      :busy="loading && items === null"
      :responsive="true"
      show-empty
      :items="items"
      :fields="fields"
      class="table table--border transactions-list__table"
      :class="{
        'transactions-list__table--disabled': dropdownIsBusy,
      }"
      :disabled="dropdownIsBusy"
      borderless
      no-border-collapse
    >
      <template #table-busy>
        <TableLoader />
      </template>
      <template #cell(level)="items">
        <router-link :to="{ name: 'block', params: { id: items.item.level } }">
          {{ items.item.level }}
        </router-link>
      </template>
      <template #cell(hash)="items">
        <router-link
          :to="{ name: 'operation', params: { id: items.item.hash } }"
          :class="{
            table__hash: minifyTableHash,
          }"
        >
          {{ items.item.hash }}
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
      <template #cell(to)="items">
        <span v-if="!items.item.to">-</span>
        <span
          v-else-if="
            items.item.to === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
          "
        >
          System Account
        </span>
        <router-link
          v-else
          :to="{ name: 'account', params: { id: items.item.to } }"
        >
          {{ items.item.to }}
        </router-link>
      </template>
      <template #cell(fees)="items">
        {{ !items.item.fees ? '-' : items.item.fees }}
      </template>
      <template #cell(amount)="items">
        <span v-if="items.item.escrow_amount">
          {{ items.item.escrow_amount | formatAmount }}
        </span>
        <span v-else-if="items.item.reclaim_escrow_amount">
          {{ items.item.reclaim_escrow_amount | formatAmount }}
        </span>
        <span v-else>
          {{ items.item.amount | formatAmount }}
        </span>
      </template>
      <template #cell(nonce)="items">
        {{ items.item.nonce }}
      </template>
      <template #cell(timestamp)="items">
        {{ items.item.timestamp | formatDate }}
        <div class="date-from-now">
          {{ items.item.timestamp | formatDaysAgo }}
        </div>
      </template>
    </b-table>
    <div v-if="fetchOnScrollEnabled && items !== null" class="list__actions">
      <b-button
        @click="handleShowMore"
        variant="outline-primary"
        class="list__button font-weight-bold"
        :class="{
          'list__button--loading': loading,
        }"
        :disabled="loading || isShowMoreButtonDisabled"
      >
        <span v-if="error">
          Something went wrong, click to retry
        </span>
        <span v-else-if="loading" disabled>
          Loading
          <font-awesome-icon
            class="list__icon"
            icon="sync-alt"
            :spin="loading"
          />
        </span>
        <span v-else ref="showMoreButton">
          Show more
          <font-awesome-icon
            class="list__icon"
            icon="arrow-circle-down"
            :spin="loading"
          />
        </span>
      </b-button>
    </div>
  </div>
</template>

<script>
import TableLoader from '@/components/TableLoader.vue';
import DateRangePicker from 'vue-daterange-picker-light';
import { mapState } from 'vuex';
import dayjs from 'dayjs';
import fetchOnScroll from '@/mixins/fetchOnScroll';
import fetchList from '@/mixins/fetchList';

// eslint-disable-next-line no-unused-expressions
import(/* webpackPreload: true */ '@/assets/styles/operationsList.scss');

export default {
  name: 'OperationsList',
  components: {
    TableLoader,
    DateRangePicker,
  },
  mixins: [fetchOnScroll, fetchList],
  props: {
    minifyTableHash: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: () => [
        { key: 'level', label: 'Height' },
        { key: 'hash', label: 'Operation Hash' },
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'nonce', label: 'Nonce' },
        { key: 'type', label: 'Type' },
        { key: 'timestamp', label: 'Date', sortable: true },
      ],
    },
  },
  data() {
    return {
      dateRange: {
        startDate: null,
        endDate: null,
      },
      operations: ['transfer', 'addescrow', 'reclaimescrow', 'other'],
      dropdownIsBusy: false,
    };
  },
  watch: {
    operations: {
      deep: true,
      async handler() {
        this.offset = 0;
        this.dropdownIsBusy = true;
        let data;

        if (this.isDatePickerSelected) {
          const from = +this.dateRange.startDate / 1000;
          const to = +this.dateRange.endDate / 1000;
          data = await this.fetchData({ from, to });
        } else {
          data = await this.fetchData();
        }

        if (data.status !== 200) {
          this.error = true;
        } else if (Array.isArray(data.data) && data.data.length === 0) {
          this.isShowMoreButtonDisabled = true;
        } else {
          this.isShowMoreButtonDisabled = false;
          this.error = false;
          this.items = data.data;
        }

        this.dropdownIsBusy = false;
      },
    },
  },
  methods: {
    formatDate(date) {
      let format;

      if (this.dateFormat === this.$constants.DATE_FORMAT_US) {
        format = 'MM.DD.YYYY';
      } else {
        format = 'DD.MM.YYYY';
      }

      return dayjs(date).format(format);
    },
    async clearFilters() {
      this.dateRange.startDate = null;
      this.dateRange.endDate = null;
      this.offset = 0;
      this.operations = ['transfer', 'addescrow', 'reclaimescrow', 'other'];
    },
    async handleCalendarUpdate(val) {
      this.dropdownIsBusy = true;
      const from = +val.startDate / 1000;
      let to = +val.endDate / 1000;

      if (this.isSelectedDatesEqual) {
        this.dateRange.endDate.setTime(
          this.dateRange.endDate.getTime() + 12 * 60 * 60 * 1000,
        );
        to = +this.dateRange.endDate / 1000;
      }

      const data = await this.fetchData({ from, to });
      const isRequestSuccessful = data.status === 200;

      if (isRequestSuccessful) {
        if (Array.isArray(data.data) && data.data.length === 0) {
          this.items = [];
          this.isShowMoreButtonDisabled = true;
        } else {
          this.isShowMoreButtonDisabled = false;
          this.error = false;
          this.offset = 0;
          this.items = data.data;
        }
      } else {
        this.error = true;
      }

      this.dropdownIsBusy = false;
    },
    fetchData(params = {}) {
      const options = {
        ...params,
        limit: this.handleShowMore,
        operation_kind: this.operations,
      };

      const otherOperationsList = [
        'registernode',
        'registerentity',
        'amendcommissionschedule',
        'registerruntime',
      ];
      const isOperationOtherSelected = this.operations.includes(
        (operation) => operation === 'other',
      );

      if (isOperationOtherSelected) {
        const otherOperationIndex = this.operations.findIndex(
          (operation) => operation === 'other',
        );

        if (otherOperationIndex >= 0) {
          options.operation_kind = [
            ...this.operations.slice(0, otherOperationIndex),
            ...otherOperationsList,
            ...this.operations.slice(otherOperationIndex + 1),
          ];
        }
      }

      if (this.isDatePickerSelected) {
        const from = +this.dateRange.startDate / 1000;
        const to = +this.dateRange.endDate / 1000;

        options.from = from;
        options.to = to;
      }

      return this.$api.getTransactions(options);
    },
  },
  computed: {
    ...mapState(['dateFormat']),
    getMinCalendarDate() {
      const now = new Date();

      return dayjs(now.setFullYear(now.getFullYear() - 3)).$d;
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
    isDatePickerSelected() {
      return this.dateRange.startDate && this.dateRange.endDate;
    },
    isSelectedDatesEqual() {
      return (
        this.dateRange.startDate.getTime() === this.dateRange.endDate.getTime()
      );
    },
  },
  created() {
    this.fetchList('getTransactions', {
      limit: this.getRequestLimit,
      operation_kind: this.operations,
    });
  },
};
</script>
