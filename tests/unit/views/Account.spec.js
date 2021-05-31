import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Account from '@/views/Account.vue';

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
      },
    });

    await nextTick();

    expect(wrapper.find('.account__information').isVisible()).toBe(true);
  });

  test('Should test 404 response and push to not found page', async () => {
    const wrapper = shallowMount(Account, {
      mocks: {
        $router,
        $route,
        $api: {
          getAccount: () => ({ status: 404 }),
        },
      },
    });

    await nextTick();

    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });
});
