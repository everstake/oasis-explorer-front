import { mount } from '@vue/test-utils';
import copyToClipboard from '@/mixins/copyToClipboard';

const Component = {
  template: '<div><span ref="qwerty">copied content</span></div>',
};

describe('copyToClipboard.js', () => {
  const removeAllRanges = jest.fn();
  const addRange = jest.fn();
  const selectNode = jest.fn();

  beforeAll(() => {
    window.getSelection = () => ({
      removeAllRanges,
      addRange,
    });
    window.document.createRange = () => ({ selectNode });
  });

  test('Should copy to clipboard', async () => {
    const wrapper = mount(Component, {
      mixins: [copyToClipboard],
    });

    wrapper.vm.copyToClipboard(wrapper.vm.$refs.qwerty);
    expect(wrapper.vm.isHashCopied(wrapper.vm.$refs.qwerty)).toBe(true);
  });
});
