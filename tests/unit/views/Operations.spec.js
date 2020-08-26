import { shallowMount } from '@vue/test-utils';
import Operations from '@/views/Operations.vue';
import OperationsList from '@/components/OperationsList.vue';

describe('Operations.vue', () => {
  test('Should render operations list', () => {
    const wrapper = shallowMount(Operations);

    expect(wrapper.find(OperationsList).exists()).toBe(true);
  });
});
