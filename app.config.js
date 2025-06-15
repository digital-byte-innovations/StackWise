const config = require('./app.json');

module.exports = ({ config: baseConfig }) => {
  // The `config` parameter from the function is the result of evaluating app.json.
  // We'll spread it to ensure we have all the base properties.
  const newConfig = { ...baseConfig };

  const IS_DEV = process.env.APP_VARIANT === 'development';

  if (IS_DEV) {
    newConfig.name = 'StackWise (Dev)';
    newConfig.android.package = 'com.digitalbyteinnovations.stackwiseslsvol2.dev';
    newConfig.ios.bundleIdentifier = 'com.digitalbyteinnovations.stackwiseslsvol2.dev';
  }

  return newConfig;
};
