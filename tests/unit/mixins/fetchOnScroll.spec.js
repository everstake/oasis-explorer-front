import { shallowMount } from '@vue/test-utils';
import fetchOnScroll from '@/mixins/fetchOnScroll';

describe('fetchOnScroll.js', () => {
  let wrapper;

  beforeEach(() => {
    const Component = {
      render() {},
      mixins: [fetchOnScroll],
    };

    wrapper = shallowMount(Component);
  });

  test('Should clear timeout on before destroy', () => {
    wrapper.destroy();
    expect(wrapper.vm.timeout).toBeNull();
  });

  test('Should test show more button', async () => {
    const removeEventListenerOnScroll = jest.spyOn(wrapper.vm, 'removeEventListenerOnScroll');
    const setEventListenerOnScroll = jest.spyOn(wrapper.vm, 'setEventListenerOnScroll');

    wrapper.setData({ isShowMoreButtonDisabled: true });
    await wrapper.vm.$nextTick();
    expect(removeEventListenerOnScroll).toBeCalled();

    wrapper.setData({ timeout: null, isShowMoreButtonDisabled: false });
    await wrapper.vm.$nextTick();
    expect(setEventListenerOnScroll).toHaveBeenCalled();
  });

  // test('Should test method onUserScroll', () => {
  //   const context = {
  //     $refs: {
  //       table: {
  //         $el: {
  //           getBoundingClientRect() {
  //             return {
  //               bottom: 1000,
  //             };
  //           },
  //         },
  //       },
  //     },
  //   };
  //
  //   const handleShowMore = jest.spyOn(wrapper.vm, 'handleShowMore');
  //   wrapper.vm.onUserScroll.call(context);
  //   expect(handleShowMore).toHaveBeenCalled();
  // });
});
