import { shallowMount } from '@vue/test-utils';
import Blocks from '@/views/Blocks.vue';
import BlocksList from '@/components/BlocksList.vue';

describe('Blocks.vue', () => {
  test('Should render blocks list', () => {
    const wrapper = shallowMount(Blocks);

    expect(wrapper.find(BlocksList).exists()).toBe(true);
  });
});
