import { shallowMount } from '@vue/test-utils';
import AccountsList from '@/components/AccountsList.vue';

const $api = {
  getAccounts: () => Promise.resolve({
    data: ['mock'],
    status: 200,
  }),
};

describe('AccountsList.vue', () => {
  test('Should render an account list', () => {
    const wrapper = shallowMount(AccountsList);
    expect(wrapper.find('.table').exists()).toBe(true);
  });

  test('Should fetch data on component created', async () => {
    const wrapper = shallowMount(AccountsList, {
      mocks: {
        $api,
      },
    });

    expect(await wrapper.vm.fetchData()).toEqual({ data: ['mock'], status: 200 });
  });

  test('Should successfully fetch data after on sort change', async () => {
    const wrapper = shallowMount(AccountsList, {
      mocks: {
        $api,
      },
    });

    await wrapper.vm.handleSortChange({ sortBy: 'asc', sortDesc: true });
    expect(wrapper.vm.items).toContain('mock');
  });

  test('Should fetch data with an error', async () => {
    const wrapper = shallowMount(AccountsList, {
      mocks: {
        $api: {
          getAccounts: () => Promise.resolve({
            status: 404,
          }),
        },
      },
    });

    await wrapper.vm.handleSortChange({ sortBy: 'asc', sortDesc: false });
    expect(wrapper.vm.items).toBeNull();
  });
});
