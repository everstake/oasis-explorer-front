import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

describe('App.vue', () => {
  test('Should render header and footer', () => {
    const wrapper = shallowMount(App, {
      stubs: ['router-view'],
    });

    expect(wrapper.find(TheHeader).exists()).toBe(true);
    expect(wrapper.find(TheFooter).exists()).toBe(true);
  });
});
