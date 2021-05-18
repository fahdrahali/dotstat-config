import { reduce } from 'ramda';
import debug from './debug';
import initConfig from './init/config';
import initHttp from './init/http';
import initRouter from './init/router';

const ressources = [initRouter, initHttp];
const initRessources = ctx => reduce((acc, initFn) => acc.then(initFn), Promise.resolve(ctx), ressources);

initConfig()
  .then(initRessources)
  .then(({ config }) => debug.info(config, 'Running config: '))
  .then(() => debug.info('🚀 server started'))
  .catch(err => debug.error(err));
