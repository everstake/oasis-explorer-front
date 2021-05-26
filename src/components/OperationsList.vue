<template>
  <div class="transactions-list">
    <div
      v-if="filters"
      class="transactions-list__filter"
    >
      <div class="transactions-list__title">
        Operations filters
      </div>
      <div class="transactions-list__container">
        <div class="transactions-list__reset">
          <b-btn
            class="transactions-list__btn"
            @click="clearFilters"
          >
            <font-awesome-icon
              icon="sync"
              :spin="dropdownIsBusy"
            />
          </b-btn>
        </div>
        <DateRangePicker
          ref="picker"
          :key="getLocaleData.format"
          v-model="dateRange"
          class="transactions-list__calendar"
          :ranges="false"
          :opens="'right'"
          :min-date="getMinCalendarDate"
          :max-date="new Date()"
          :locale-data="getLocaleData"
          @update="handleCalendarUpdate"
        >
          <template
            v-slot:input="picker"
            style="min-width: 350px;"
          >
            <div
              slot="input"
              class="transactions-list__label"
            >
              Select date
              <font-awesome-icon
                class="transactions-list__icon"
                icon="calendar-check"
              />
            </div>
            <span
              v-if="dateRange.startDate && dateRange.endDate"
              class="transactions-list__date"
            >
              {{ formatDate(picker.startDate) }} -
              {{ formatDate(picker.endDate) }}
            </span>
          </template>
        </DateRangePicker>
        <div class="transactions-dropdown">
          <b-dropdown
            id="dropdown-1"
            text="Select type"
          >
            <b-dropdown-form
              class="transactions-dropdown__content"
              :disabled="dropdownIsBusy"
              :class="{
                'transactions-dropdown--disabled': dropdownIsBusy,
              }"
            >
              <b-form-checkbox
                v-model="operations"
                :disabled="
                  operations.length === 1 && operations[0] === 'transfer'
                "
                value="transfer"
                class="mb-3"
              >
                Transfers
              </b-form-checkbox>

              <b-form-checkbox
                v-model="operations"
                :disabled="
                  operations.length === 1 && operations[0] === 'addescrow'
                "
                value="addescrow"
                class="mb-3"
              >
                Addescrow
              </b-form-checkbox>

              <b-form-checkbox
                v-model="operations"
                :disabled="
                  operations.length === 1 && operations[0] === 'reclaimescrow'
                "
                value="reclaimescrow"
                class="mb-3"
              >
                Reclaimescrow
              </b-form-checkbox>

              <b-form-checkbox
                v-model="operations"
                disabled
                value="burn"
                class="mb-3"
              >
                Burn
              </b-form-checkbox>

              <b-form-checkbox
                v-model="operations"
                :disabled="operations.length === 1 && operations[0] === 'other'"
                value="other"
              >
                Other
              </b-form-checkbox>
            </b-dropdown-form>
          </b-dropdown>
        </div>
      </div>
    </div>
    <CommonTable
      class="transactions-list__table"
      request-name="getTransactions"
      :fields="fields"
      :is-fetch-on-scroll-enabled="isFetchOnScrollEnabled"
      :fetch-params="fetchParams"
      :height="height"
    >
      <template #cell(level)="{ item: { level }}">
        <router-link
          :to="{ name: 'block', params: { id: level } }"
        >
          {{ level }}
        </router-link>
      </template>

      <template #cell(hash)="{ item: { hash }}">
        <router-link
          :to="{ name: 'operation', params: { id: hash } }"
        >
          {{ hash | trimHash }}
        </router-link>
      </template>

      <template #cell(from)="{ item: { from }}">
        <router-link
          v-if="from"
          :to="{ name: 'account', params: { id: from } }"
        >
          {{ from | trimHash }}
        </router-link>

        <span v-else>-</span>
      </template>

      <template #cell(to)="{ item: { to }}">
        <span v-if="to === $constants.SYSTEM_ACCOUNT_ID">
          System Account
        </span>

        <router-link
          v-else-if="to"
          :to="{ name: 'account', params: { id: to } }"
        >
          {{ to | trimHash }}
        </router-link>

        <span v-else>-</span>
      </template>

      <template #cell(fees)="{ item: { fees }}">
        {{ fees || '-' }}
      </template>

      <template
        #cell(amount)="{
          item: { amount, escrow_amount, reclaim_escrow_amount }
        }"
      >
        <span v-if="escrow_amount">
          {{ escrow_amount | formatAmount }}
        </span>

        <span v-else-if="reclaim_escrow_amount">
          {{ reclaim_escrow_amount | formatAmount }}
        </span>

        <span v-else>
          {{ amount | formatAmount }}
        </span>
      </template>

      <template #cell(status)="{ item: { status } }">
        <StatusIcon
          :status="status"
        />
      </template>

      <template #cell(timestamp)="{ item: { timestamp }}">
        {{ timestamp | formatDate }}

        <div class="common-table__format-days-ago">
          {{ timestamp | formatDaysAgo }}
        </div>
      </template>
    </CommonTable>
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable.vue';
import DateRangePicker from 'vue-daterange-picker-light';
import { mapState } from 'vuex';
import dayjs from 'dayjs';
import { DEFAULT_HEIGHT } from '@/components/CommonTable/constants';
import StatusIcon from '@/components/StatusIcon.vue';

export default {
  name: 'OperationsList',
  components: {
    DateRangePicker,
    CommonTable,
    StatusIcon,
  },
  props: {
    fields: {
      type: Array,
      default: () => [
        { key: 'level', label: 'Height' },
        { key: 'hash', label: 'Operation Hash' },
        { key: 'from', label: 'From' },
        { key: 'to', label: 'To' },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'nonce', label: 'Nonce' },
        { key: 'status', label: 'Status' },
        { key: 'type', label: 'Type' },
        { key: 'timestamp', label: 'Date', sortable: true },
      ],
    },
    filters: {
      type: Boolean,
      default: false,
    },
    listFetchParams: {
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
  },
  data() {
    return {
      dateRange: {
        startDate: null,
        endDate: null,
      },
      operations: ['transfer', 'addescrow', 'reclaimescrow', 'other'],
      otherOperations: ['registernode', 'registerentity', 'amendcommissionschedule', 'registerruntime'],
      dropdownIsBusy: false,
      fetchParams: {},
    };
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
  watch: {
    operations: {
      deep: true,
      async handler() {
        this.dropdownIsBusy = true;

        if (this.isDatePickerSelected) {
          const from = +this.dateRange.startDate / 1000;
          const to = +this.dateRange.endDate / 1000;
          this.setFetchParams({ from, to });
        } else {
          this.setFetchParams();
        }

        this.dropdownIsBusy = false;
      },
    },
  },
  created() {
    this.setFetchParams();
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

      this.setFetchParams({ from, to });

      this.dropdownIsBusy = false;
    },
    setFetchParams(params = {}) {
      const options = {
        ...params,
        ...this.listFetchParams,
        operation_kind: this.operations,
      };

      const isOperationOtherSelected = this.operations.some(
        (operation) => operation === 'other',
      );

      const otherOperationIndex = this.operations.findIndex(
        (operation) => operation === 'other',
      );

      if (isOperationOtherSelected && otherOperationIndex >= 0) {
        options.operation_kind = [
          ...this.operations.slice(0, otherOperationIndex),
          ...this.otherOperations,
          ...this.operations.slice(otherOperationIndex + 1),
        ];
      }

      if (this.isDatePickerSelected) {
        const from = +this.dateRange.startDate / 1000;
        const to = +this.dateRange.endDate / 1000;

        options.from = from;
        options.to = to;
      }

      this.fetchParams = options;
    },
  },
};
</script>

<style lang="scss">
.transactions-list {
  &__actions {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  &__icon {
    margin-left: 10px;

    @include from-480-down {
      display: none;
    }
  }

  &__date {
    margin-left: 10px;
    font-weight: 700;
    color: $color-white;
  }

  &__filter {
    margin-bottom: 10px;
    font-family: $open-sans;
    font-size: 16px;
  }

  &__reset {
    margin-right: 10px;
    & .btn-secondary {
      background-color: $color-primary !important;
      border-color: $color-primary !important;
    }
  }

  &__btn {
    &:focus,
    &:active,
    &:hover,
    &:active:focus {
      box-shadow: none !important;
    }
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &__title {
    margin-bottom: 5px;
    font-family: $open-sans;
    font-size: 16px;
    color: $color-gray-666;
  }

  &__calendar {
    margin-right: 10px;
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

  &__table {
    box-shadow: $box-shadow-table;
    margin-bottom: 16px;
  }
}

.transactions-dropdown {
  &__content {
    min-width: 150px;
    font-size: 15px;

    & form {
      padding: 0.25rem 0.7rem;
    }

    & form:focus {
      outline: none !important;
    }

    & label {
      margin-bottom: 0;
      padding-left: 0.5rem;
    }

    & .custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
      background-color: green!important;
    }

    & .custom-checkbox .custom-control-input:checked:focus ~ .custom-control-label::before {
      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 255, 0, 0.25)
    }

    & .custom-checkbox .custom-control-input:focus ~ .custom-control-label::before {
      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 0, 0, 0.25)
    }

    & .custom-checkbox .custom-control-input:active ~ .custom-control-label::before {
      background-color: #C8FFC8;
    }
  }

  & .btn-secondary {
    display: flex;
    align-items: center;
    font-size: 15px;
    background-color: $color-primary !important;
    border: 2px solid $color-primary !important;
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
