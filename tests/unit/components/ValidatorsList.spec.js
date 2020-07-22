import { shallowMount } from '@vue/test-utils';
import ValidatorsList from '@/components/ValidatorsList.vue';

describe('ValidatorsList.vue', () => {
  test('Should successfully fetch blocks list', async () => {
    const wrapper = shallowMount(ValidatorsList);

    expect(await wrapper.vm.fetchData()).toEqual({ data: ['mock'], status: 200 });
  });

  test('Should filter companies with white logotypes', () => {
    const wrapper = shallowMount(ValidatorsList);

    expect(wrapper.vm.filterWhiteColorLogotypes('witval')).toBe('witval');
    expect(wrapper.vm.filterWhiteColorLogotypes('forbole')).toBe('forbole');
  });
});
