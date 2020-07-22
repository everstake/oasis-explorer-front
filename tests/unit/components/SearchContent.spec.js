import SearchContent from '@/components/SearchContent.vue';
import { shallowMount } from '@vue/test-utils';

describe('SearchContent.vue', () => {
  test('Should test passed props', async () => {
    const wrapper = shallowMount(SearchContent, { propsData: { autofocus: true } });
    expect(wrapper.find('.search__content').exists()).toBe(true);
  });
});
