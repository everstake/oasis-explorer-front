/*eslint-disable*/
const webpack = require('webpack');

module.exports = {
  productionSourceMap: process.env.NODE_ENV != 'production',
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ru/),
    ],
  },
  css: {
    extract: true,
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
    // config.plugins.delete('prefetch');
    // config.plugin('preload').tap((options) => {
    //   options[0].as = (entry) => {
    //     if (/\.css$/.test(entry)) return 'style';
    //     if (/\.woff$/.test(entry)) return 'font';
    //     if (/\.png$/.test(entry)) return 'image';
    //     return 'script';
    //   };
    //   options[0].include = 'allAssets';
    //   // options[0].fileWhitelist: [/\.files/, /\.to/, /\.include/]
    //   // options[0].fileBlacklist: [/\.files/, /\.to/, /\.exclude/]
    //   return options;
    // });
    config.plugin('html').tap((args) => {
      // eslint-disable-next-line no-param-reassign
      args[0].title = 'Oasis Monitor';
      return args;
    });
  },
};
