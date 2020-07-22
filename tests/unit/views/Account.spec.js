import { shallowMount } from '@vue/test-utils';
import Account from '@/views/Account.vue';
import flushPromises from 'flush-promises';

const $api = {
  getAccount: () => Promise.resolve({ data: { address: 'oasis1account' }, status: 200 }),
};

const $router = { push: jest.fn() };

const $route = {
  params: {
    id: 'oasis1account',
  },
};

describe('Account.vue', () => {
  test('Should test 200 response and render an account', async () => {
    const wrapper = shallowMount(Account, {
      mocks: {
        $route,
        $api,
      },
    });

    await flushPromises();

    expect(wrapper.find('.account__information').isVisible()).toBe(true);
  });

  test('Should test 404 response and push to not found page', async () => {
    const wrapper = shallowMount(Account, {
      mocks: {
        $router,
        $route,
        $api: {
          getAccount: () => Promise.resolve({ data: {}, status: 404 }),
        },
      },
    });

    await flushPromises();

    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });

  test('Should change current router path', async () => {
    const wrapper = shallowMount(Account, {
      mocks: {
        $route,
        $api,
      },
      sync: false,
    });

    await flushPromises();

    expect(wrapper.vm.$route.params.id).toBe('oasis1account');
  });
});
