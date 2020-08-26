import { shallowMount } from '@vue/test-utils';
import Accounts from '@/views/Accounts.vue';
import AccountsList from '@/components/AccountsList.vue';

describe('Accounts.vue', () => {
  test('Should render accounts list', () => {
    const wrapper = shallowMount(Accounts);

    expect(wrapper.find(AccountsList).exists()).toBe(true);
  });
});
