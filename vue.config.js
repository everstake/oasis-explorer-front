module.exports = {
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/styles/variables";
          @import "@/assets/styles/mixins";
          @import "@/assets/styles/animations";
        `,
      },
    },
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Oasis Explorer'
        return args
      })
  },
};
