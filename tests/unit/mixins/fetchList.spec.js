import fetchList from '@/mixins/fetchList';
import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

const Component = {
  render() {},
  mixins: [fetchList],
};

describe('fetchList.js', () => {
  test('Should set limit of requested items from props', () => {

    const wrapper = shallowMount(Component, {
      propsData: {
        rows: 10,
      },
    });

    expect(wrapper.vm.getRequestLimit).toBe(10);
  });

  test('Should set limit of requested items from options', () => {
    const wrapper = shallowMount(Component);

    expect(wrapper.vm.getRequestLimit).toBe(wrapper.vm.limit);
  });

  test('Should test positive case of fetching a list', async () => {
    const $api = {
      getAccounts: () => new Promise((resolve) => {
        const data = { data: [{ account: 'oasis1account' }], status: 200 };
        resolve(data);
      }),
    };

    const wrapper = shallowMount(Component, {
      mocks: {
        $api,
      },
    });

    wrapper.vm.fetchList('getAccount', {});
    await flushPromises();
    expect(wrapper.vm.error).toBe(false);
  });

  test('Should test a negative case of fetching a list', async () => {
    const $api = {
      getAccounts: () => new Promise((resolve) => {
        const data = { status: 503 };
        resolve(data);
      }),
    };

    const wrapper = shallowMount(Component, {
      mocks: {
        $api,
      },
    });

    wrapper.vm.fetchList('getAccount', {});
    await flushPromises();
    expect(wrapper.vm.error).toBe(true);
  });
});
