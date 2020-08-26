import { shallowMount } from '@vue/test-utils';
import getDatesInSeconds from '@/mixins/getDatesInSeconds';

const Component = {
  render: () => {},
  mixins: [getDatesInSeconds],
};

describe('getDatesInSeconds.js', () => {
  test('Should return two dates: today and one month ago', () => {
    const getTodayInSeconds = () => Math.round(new Date().getTime() / 1000);
    const getPreviousDate = (offset) => {
      const findedDateMs = new Date(new Date().setDate(new Date().getDate() - offset)).getTime();
      return Math.round(findedDateMs / 1000);
    };
    const getFutureDate = (offset) => {
      const findedDateMs = new Date(new Date().setDate(new Date().getDate() + offset)).getTime();
      return Math.round(findedDateMs / 1000);
    };
    const wrapper = shallowMount(Component);

    expect(wrapper.vm.datesInSeconds.today).toBe(getTodayInSeconds());
    expect(wrapper.vm.datesInSeconds.monthAgo).toBe(getPreviousDate(30));
    expect(wrapper.vm.getFutureDate(1)).toBe(getFutureDate(1));
  });
});
