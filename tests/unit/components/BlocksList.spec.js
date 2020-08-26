import { shallowMount } from '@vue/test-utils';
import BlocksList from '@/components/BlocksList.vue';

describe('BlocksList.vue', () => {
  test('Should successfully fetch blocks list', async () => {
    const wrapper = shallowMount(BlocksList);

    expect(await wrapper.vm.fetchData()).toEqual({ data: ['mock'], status: 200 });
  });
});
