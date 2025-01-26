// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // If you want to add .otf, etc.
  config.resolver.assetExts.push('otf');

  // Only if you're using SVG as a component:
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts.push('svg');
  config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

  return config;
})();
