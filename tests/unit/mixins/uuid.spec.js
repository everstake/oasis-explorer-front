import uuid from '@/mixins/uuid';
import { shallowMount } from '@vue/test-utils';

describe('uuid.js', () => {
  const Component = { render() {} };
  test('Should return unique identifier', () => {
    const wrapper = shallowMount(Component, { mixins: [uuid] });

    expect(typeof wrapper.vm.getKey()).toBe('string');
  });
});
