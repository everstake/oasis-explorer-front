import { shallowMount } from '@vue/test-utils';
import Account from '@/views/Account.vue';

const $router = { push: jest.fn() };

const $route = {
  params: {
    id: 'oasis1account',
  },
};

describe('Account.vue', () => {
  let serverResponse;

  beforeEach(() => {
    serverResponse = { data: { address: 'oasis1account' }, status: 200 };
  });

  test('Should test 200 response and render an account', async () => {
    const wrapper = shallowMount(Account, {
      mocks: {
        $route,
        $api: {
          getAccount: () => jest.fn().mockReturnValue(serverResponse),
        },
      },
    });

    await wrapper.vm.fetchData();

    expect(wrapper.find('.account__information').isVisible()).toBe(true);
  });

  test('Should test 404 response and push to not found page', async () => {
    const wrapper = shallowMount(Account, {
      mocks: {
        $router,
        $route,
        $api: {
          getAccount: () => jest.fn().mockReturnValue({ status: 404 }),
        },
      },
    });

    await wrapper.vm.fetchData();

    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });
});
