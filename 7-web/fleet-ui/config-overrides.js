const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config) {
  config.resolve.fallback = {
    process: require.resolve('process/browser'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer')
  };

  config.plugins.forEach((plugin) => {
    if (plugin instanceof WorkBoxPlugin.InjectManifest) {
      plugin.config.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024;
    }
  });

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    })
  ];

  return config;
};
