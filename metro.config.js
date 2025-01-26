// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { resolver: { assetExts, sourceExts } } = config;

  // Remove 'svg' from assetExts and add it to sourceExts
  config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts = [...sourceExts, 'svg'];

  // Add font extensions to assetExts
  config.resolver.assetExts = [
    ...config.resolver.assetExts,
    'ttf',
    'otf',
    'eot',
    'woff',
    'woff2',
  ];

  config.transformer = {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    assetPlugins: ['expo-asset/tools/hashAssetFiles'], // Enables asset hashing
  };

  return config;
})();
