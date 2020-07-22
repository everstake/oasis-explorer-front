import { mutations } from '@/store/index';
import { shallowMount } from '@vue/test-utils';

describe('index.js', () => {
  test('Should test setInfo mutation', () => {
    const state = { height: null };

    mutations.setInfo(state, '100');
    expect(state).toEqual({ height: 100 });
  });
});
