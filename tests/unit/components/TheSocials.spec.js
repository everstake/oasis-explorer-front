import { shallowMount } from '@vue/test-utils';
import TheSocials from '@/components/TheSocials.vue';

describe('TheSocials.vue', () => {
  test('Should test passed props', () => {
    const expectedProps = {
      facebook: 'https://www.facebook.com/everstake.one',
      medium: 'https://medium.com/everstake',
      twitter: 'https://twitter.com/everstake_pool',
    };

    const wrapper = shallowMount(TheSocials);

    expect(wrapper.props('links')).toEqual(expectedProps);
  });
});
