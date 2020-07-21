import { shallowMount } from '@vue/test-utils';
import BlocksList from '@/components/BlocksList.vue';

const $api = {
  getBlocks: () => Promise.resolve({
    data: ['mock'],
    status: 200,
  }),
};

describe('BlocksList.vue', () => {
  test('Should successfully fetch blocks list', async () => {
    const wrapper = shallowMount(BlocksList, {
      mocks: { $api },
    });

    expect(await wrapper.vm.fetchData()).toEqual({ data: ['mock'], status: 200 });
  });
});
