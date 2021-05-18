import debug from '../debug';
import params from '../params';


const init = () => {
  debug.info(`running "${params.env}" env`);
  return Promise.resolve({ config: params });
};

export default init;
