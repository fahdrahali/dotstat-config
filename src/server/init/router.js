import express from 'express';
import path from 'path';
import debug from '../debug';

const expressPino = require('express-pino-logger')({ logger: debug });

const startTime = new Date();
const init = ctx => {
  const app = express();
  const { config: { gitHash } } = ctx;
  app.use('/ping', (req, res) => res.json({ ping: 'pong' }));
  app.use('/healthcheck', (req, res) => res.json({ gitHash, startTime }));
  app.use(expressPino);
  app.use('/configs', express.static(path.join(__dirname, '../../../configs')));
  app.use('/assets', express.static(path.join(__dirname, '../../../assets')));
  app.use('/i18n', express.static(path.join(__dirname, '../../../i18n')));
  return Promise.resolve({ ...ctx, app });
};

module.exports = init;
