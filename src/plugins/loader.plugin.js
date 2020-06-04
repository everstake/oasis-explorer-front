import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
});

let loaderTimeout = null;

const clearLoaderTimeout = () => {
  if (loaderTimeout) {
    clearTimeout(loaderTimeout);
    loaderTimeout = null;
  }
};

const startLoader = () => {
  clearLoaderTimeout();
  loaderTimeout = setTimeout(() => {
    NProgress.start();
  }, 100);
};

const stopLoader = () => {
  clearLoaderTimeout();
  NProgress.done();
};

export {
  startLoader,
  stopLoader,
};
