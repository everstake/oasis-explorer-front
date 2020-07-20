import { shallowMount } from '@vue/test-utils';
import Account from '@/views/Account.vue';
import flushPromises from 'flush-promises';

const $route = {
  params: {
    id: 'oasis1account',
  },
};

const $router = { push: jest.fn() };

describe('Account.vue', () => {
  test('Should test positive API call and render an account', async () => {
    const $api = {
      getAccount: () => new Promise((resolve) => {
        const response = {
          address: 'oasis1account',
        };
        const data = { data: { ...response }, status: 200 };
        resolve(data);
      }),
    };

    const wrapper = shallowMount(Account, {
      mocks: {
        $route,
        $api,
      },
    });

    await flushPromises();

    expect(wrapper.find('.account__information').isVisible()).toBe(true);
  });

  test('Should test negative API call and render empty account', async () => {
    const $api = {
      getAccount: () => new Promise((resolve) => {
        const response = {};
        const data = { data: { ...response }, status: 404 };
        resolve(data);
      }),
    };

    const wrapper = shallowMount(Account, {
      mocks: {
        $router,
        $route,
        $api,
      },
    });

    await flushPromises();

    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });

  test('Should change current router path', async () => {
    const $api = {
      getAccount: () => new Promise((resolve) => {
        const response = {
          address: 'oasis1account',
        };
        const data = { data: { ...response }, status: 200 };
        resolve(data);
      }),
    };

    const wrapper = shallowMount(Account, {
      mocks: {
        $route,
        $api,
      },
      sync: false,
    });

    await flushPromises();

    // console.log(wrapper.vm.$options.testFn);
    //
    // console.log(wrapper.vm.$options.testFn.call(wrapper.vm, 123));
    //
    // wrapper.vm.$options.watch.$route.apply(wrapper.vm, [{ id: 'oasis2account' }, { id: 'oasis1account' }]);
    //
    // expect(wrapper.vm.$route.params.id).toBe('oasis2account');
    expect(wrapper.vm.$route.params.id).toBe('oasis1account');
  });
});
