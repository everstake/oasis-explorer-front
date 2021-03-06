import { shallowMount } from '@vue/test-utils';
import Error from '@/views/Error.vue';

describe('Error.vue', () => {
  test('Should render 404 message', () => {
    const wrapper = shallowMount(Error, {
      propsData: { status: 404 },
    });

    expect(wrapper.text()).toMatch('Page not found');
  });

  test('Should render 503 message', () => {
    const wrapper = shallowMount(Error, {
      propsData: { status: 503 },
    });

    expect(wrapper.text()).toMatch('Something went wrong');
  });
});
