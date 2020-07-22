import TheSearch from '@/components/TheSearch.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

describe('TheSearch.vue', () => {
  let wrapper;

  beforeEach(() => {
    const routes = [{ name: 'home', path: 'home' }, { name: 'block', path: 'block' }];
    const router = new VueRouter({ routes });

    const localVue = createLocalVue();
    localVue.use(VueRouter);

    wrapper = shallowMount(TheSearch, {
      localVue,
      router,
    });
  });

  test('Should show and hide the search page', async () => {
    wrapper.find('.search__icon').trigger('click');
    expect(wrapper.vm.isSearchVisible).toBe(true);

    await wrapper.vm.$nextTick();

    wrapper.find('.search__close').trigger('click');
    expect(wrapper.vm.isSearchVisible).toBe(false);
  });

  test('Should change route and hide the search page', async () => {
    wrapper.find('.search__icon').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.vm.$router.push({ name: 'home' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSearchVisible).toBe(false);
  });

  test('Should handle empty search submit', async () => {
    expect(await wrapper.vm.handleSubmit('')).toBe(false);
  });

  test('Should handle search string that leads to the current page', async () => {
    wrapper.vm.$router.push({ name: 'home', params: { id: 'oasis1mock' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$route.params.id).toBe('oasis1mock');
    wrapper.vm.handleSubmit('oasis1mock');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSearchVisible).toBe(false);
  });
});
