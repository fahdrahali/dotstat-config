'use strict';

const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');
const R = require('ramda');

const ROOT_PATH = process.env.ROOT_PATH || 'data/default/i18n';
const ENV_PATH = process.env.ENV_PATH || 'data/@(dev|prod)/i18n';
const ALLOWED_APP_IDS = ['data-explorer', 'data-lifecycle-manager'];

const args = process.argv.slice(3);
const appId = R.head(args);
if (! R.includes(appId, ALLOWED_APP_IDS)) {
  console.log(chalk.red('ERROR allowed app ids are', ALLOWED_APP_IDS));
  process.exit(1);
}

const oldKeysPath = `${ROOT_PATH}/${appId}.json`;
const newKeysPath = process.env.KEYS_PATH || `../dotstatsuite-${appId}/keys.json`;

try {
  if (fs.existsSync(newKeysPath)) {
    // update keys of the current app
    console.log(chalk.cyan(`   INFO Update keys ${newKeysPath} --> ${oldKeysPath}`));
    fs.writeFileSync(`${ROOT_PATH}/${appId}.json`, fs.readFileSync(newKeysPath, 'utf8'));

    // merge all keys of all apps in default
    const apps = glob.sync(`${ROOT_PATH}/*.json`);
    const allKeys = R.toPairs(
      apps.map(path => {
        return JSON.parse(fs.readFileSync(path, "utf8"));
      }).reduce((memo, keys) => {
        return { ...memo, ...keys };
      }, {})
    );

    // update all locales with all keys
    const locales = glob.sync(`${ENV_PATH}/*.json`);
    locales.map(path => {
      const oldKeys = JSON.parse(fs.readFileSync(path, "utf8"));
      const newKeys = R.reduce(
        (memo, [ key, defaultMessage ]) => {
          return { ...memo, [key]: oldKeys[key] || defaultMessage };
        },
        {},
        allKeys,
      );

      fs.writeFileSync(path, JSON.stringify(newKeys, null, 2));
    });

    console.log(chalk.green(`SUCCESS ${locales.length} locales updated with ${allKeys.length} keys`));
  } else {
    console.log(chalk.red('ERROR path to new keys is invalid', newKeysPath));
    process.exit(1);
  }
} catch(err) {
  console.error(err);
  process.exit(1);
}