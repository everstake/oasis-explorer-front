const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ru/),
    ],
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/styles/variables";
          @import "@/assets/styles/mixins";
          @import "@/assets/styles/animations";
        `,
        sourceMap: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      // eslint-disable-next-line no-param-reassign
      args[0].title = 'Oasis Monitor';
      return args;
    });
  },
};
