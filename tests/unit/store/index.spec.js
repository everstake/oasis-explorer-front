import { mutations } from '@/store/index';

describe('index.js', () => {
  test('Should mutate state height property', () => {
    const state = { height: null };
    const payload = { height: 100 };

    mutations.setInfo(state, payload);
    expect(state).toEqual({ height: 100 });
  });

  test('Should mutate state date format property', () => {
    const state = { dateFormat: 'HH:mm DD.MM.YYYY' };
    const payload = 'hh:mm A MM.DD.YYYY';

    mutations.setDateFormat(state, payload);
    expect(state).toEqual({ dateFormat: 'hh:mm A MM.DD.YYYY' });
  });
});
