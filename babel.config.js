// babel.config.js

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add other valid Babel plugins here if needed
      // For example: '@babel/plugin-transform-runtime',
    ],
  };
};
