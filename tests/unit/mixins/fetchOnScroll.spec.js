import { shallowMount } from '@vue/test-utils';
import fetchOnScroll from '@/mixins/fetchOnScroll';

const Component = {
  render: () => {},
  mixins: [fetchOnScroll],
};

describe('fetchOnScroll.js', () => {
  test('', () => {
    const wrapper = shallowMount(Component);
  });
});
