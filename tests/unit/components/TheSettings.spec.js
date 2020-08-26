import TheSettings from '@/components/TheSettings.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

describe('TheSettings.vue', () => {
  let wrapper;

  beforeEach(() => {
    const routes = [{ name: 'home', path: 'home' }];
    const router = new VueRouter({ routes });

    const localVue = createLocalVue();
    localVue.use(VueRouter);

    wrapper = shallowMount(TheSettings, {
      localVue,
      router,
    });
  });

  test('Should show and hide the search page', async () => {
    wrapper.find('.settings__icon').trigger('click');
    expect(wrapper.vm.isSettingsVisible).toBe(true);

    await wrapper.vm.$nextTick();

    wrapper.find('.settings__close').trigger('click');
    expect(wrapper.vm.isSettingsVisible).toBe(false);
  });

  test('Should change route and hide the search page', async () => {
    wrapper.find('.settings__icon').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.vm.$router.push({ name: 'home' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSettingsVisible).toBe(false);
  });

  test('Should handle form submit', () => {
    const props = {
      name: 'mock',
      email: 'mock',
      subscribe: true,
    };

    jest.spyOn(Storage.prototype, 'setItem');
    jest.useFakeTimers();

    wrapper.vm.handleSubmit(props);
    expect(localStorage.setItem).toHaveBeenCalledTimes(3);

    jest.runAllTimers();
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });
});
