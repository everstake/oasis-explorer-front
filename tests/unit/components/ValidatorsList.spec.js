import { shallowMount } from '@vue/test-utils';
import ValidatorsList from '@/components/ValidatorsList.vue';

const $api = {
  getValidators: () => Promise.resolve({
    data: ['mock'],
    status: 200,
  }),
};

describe('ValidatorsList.vue', () => {
  test('Should successfully fetch blocks list', async () => {
    const wrapper = shallowMount(ValidatorsList, {
      mocks: { $api },
    });

    expect(await wrapper.vm.fetchData()).toEqual({ data: ['mock'], status: 200 });
  });
});
