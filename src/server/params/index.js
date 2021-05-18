const R = require('ramda');
require('../env');
const defaultConfig = require('./default');
const supportedModes = {
  development: require('./development'),
  production: require('./production'),
  test: require('./test'),
};
const config = supportedModes[process.env.NODE_ENV || 'development'];

module.exports = R.merge(defaultConfig, config || {});
