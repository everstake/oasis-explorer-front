import {
  config,
  mount,
} from '@vue/test-utils';
import { nextTick } from 'vue';
import CommonTable from '@/components/CommonTable/CommonTable.vue';
import { v4 as uuidv4 } from 'uuid';

describe('CommonTable.vue', () => {
  const requestName = 'getTableData';
  const fields = [{ key: 'test', label: 'test' }];

  config.mocks.$api[requestName] = ({ itemCount, status }) => ({
    data: Array(itemCount || 1).fill().map(() => (
      { test: uuidv4() }
    )),
    status: status || 200,
  });

  it('should render a table', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
      },
    });

    await nextTick();

    expect(wrapper.find('.table').exists()).toBe(true);
  });

  it('should toggle `loading` flag while loading data is in progress', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
      },
    });

    await nextTick();

    wrapper.vm.fetch();

    expect(wrapper.vm.loading).toBe(true);

    await nextTick();

    expect(wrapper.vm.loading).toBe(false);
  });

  it('should set `error` to `true` if status of response is not equal 200', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          status: 400,
        },
      },
    });

    expect(wrapper.vm.error).toBe(false);

    await nextTick();

    expect(wrapper.vm.error).toBe(true);
  });

  it('should update `items` array if loading data', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          itemCount: 1,
          limit: 1,
        },
      },
    });

    await nextTick();

    const oldItems = wrapper.vm.items;

    wrapper.vm.fetch();

    await nextTick();

    expect(wrapper.vm.items[0].test).not.toBe(oldItems[0].test);
    expect(wrapper.vm.items[0]).not.toBe(undefined);
  });

  it('should update `items` if property `fetchParams` is changed', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          itemCount: 1,
          limit: 1,
        },
      },
    });

    await nextTick();

    const oldItems = wrapper.vm.items;

    wrapper.setProps({
      fetchParams: {
        itemCount: 2,
        limit: 2,
      },
    });

    await nextTick();

    expect(wrapper.vm.items[0].test).not.toBe(oldItems[0].test);
    expect(wrapper.vm.items.length).toBe(2);
  });

  it('should increase `offset` by length of `limit` if fetch option concat is true', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          itemCount: 2,
          limit: 2,
        },
      },
    });

    await nextTick();

    expect(wrapper.vm.offset).toBe(0);

    wrapper.vm.fetch({ concat: true });

    await nextTick();

    expect(wrapper.vm.offset).toBe(2);

    wrapper.vm.fetch({ concat: true });

    await nextTick();

    expect(wrapper.vm.offset).toBe(4);
  });

  it('should merge old data and new data if fetch option concat is true', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          itemCount: 1,
          limit: 1,
        },
      },
    });

    await nextTick();

    const oldItems = wrapper.vm.items;

    wrapper.vm.fetch({ concat: true });

    await nextTick();

    expect(wrapper.vm.items[0].test).toBe(oldItems[0].test);
    expect(wrapper.vm.items.length).toBe(2);
  });

  it('should set `hasTableAllData` to `true` if amount of data received is less than amount requested', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          itemCount: 1,
          limit: 2,
        },
      },
    });

    expect(wrapper.vm.hasTableAllData).toBe(false);

    await nextTick();

    expect(wrapper.vm.hasTableAllData).toBe(true);
  });

  it('should sort table local by default', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
      },
    });

    await nextTick();

    expect(wrapper.vm.isSortViaApiEnabled).toBe(false);
    expect(wrapper.vm.shouldSortLocal).toBe(true);
  });

  it('should sort table via API if `isSortViaApiEnabled` is set to `true` and amount of data received is equal amount requested', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        isSortViaApiEnabled: true,
        fetchParams: {
          itemCount: 1,
          limit: 1,
        },
      },
    });

    await nextTick();

    expect(wrapper.vm.isSortViaApiEnabled).toBe(true);
    expect(wrapper.vm.shouldSortLocal).toBe(false);
  });

  it('should sort table local if `isSortViaApiEnabled` is set to `true` and amount of data received is less than amount requested', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        isSortViaApiEnabled: true,
        fetchParams: {
          itemCount: 1,
          limit: 2,
        },
      },
    });

    await nextTick();

    expect(wrapper.vm.isSortViaApiEnabled).toBe(true);
    expect(wrapper.vm.shouldSortLocal).toBe(true);
  });

  it('should update `sortParams` on sort if data sort on api', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        isSortViaApiEnabled: true,
        fetchParams: {
          itemCount: 1,
          limit: 1,
        },
      },
    });

    await nextTick();

    const oldSortParams = wrapper.vm.sortParams;

    const sortСtx = {
      sortBy: fields[0].key,
      sortDesc: true,
    };

    wrapper.vm.fetchSorted(sortСtx);

    await nextTick();

    expect(wrapper.vm.sortParams).not.toBe(oldSortParams);
    expect(wrapper.vm.sortParams.sort_column).toBe(sortСtx.sortBy);
    expect(wrapper.vm.sortParams.sort_side).toBe('desc');
  });

  it('shouldn\'t update `sortParams` on sort if data sort local', async () => {
    const wrapper = mount(CommonTable, {
      propsData: {
        fields,
        requestName,
        fetchParams: {
          itemCount: 1,
          limit: 1,
        },
      },
    });

    await nextTick();

    const oldSortParams = wrapper.vm.sortParams;

    const sortСtx = {
      sortBy: fields[0].key,
      sortDesc: true,
    };

    wrapper.vm.fetchSorted(sortСtx);

    await nextTick();

    expect(wrapper.vm.sortParams).toBe(oldSortParams);
    expect(wrapper.vm.sortParams.sort_column).not.toBe(sortСtx.sortBy);
    expect(wrapper.vm.sortParams.sort_side).not.toBe('desc');
  });
});
