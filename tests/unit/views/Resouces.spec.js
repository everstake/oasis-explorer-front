import { shallowMount } from '@vue/test-utils';
import Resources from '@/views/Resources.vue';

describe('Resources.vue', () => {
  test('Should render resources', () => {
    const wrapper = shallowMount(Resources);

    expect(wrapper.text()).toMatch('oasislabs.com');
  });
});
