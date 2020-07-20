import { shallowMount } from '@vue/test-utils';
import Validators from '@/views/Validators.vue';
import ValidatorsList from '@/components/ValidatorsList.vue';

describe('Validators.vue', () => {
  test('Should render validators list', () => {
    const wrapper = shallowMount(Validators);

    expect(wrapper.find(ValidatorsList).exists()).toBe(true);
  });
});
