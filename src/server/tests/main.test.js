import axios from 'axios';
import initHttp from '../init/http';
import initRouter from '../init/router';

const config = {
  isProduction: false,
  server: {
    host: 'localhost',
  },
};

let SERVER;

beforeAll(() =>
  initRouter({ config })
    .then(initHttp)
    .then(({ httpServer }) => (SERVER = httpServer)),
);
afterAll(() => SERVER.close());

describe('server', () => {
  it('should serve fake data', () => axios.get(`${SERVER.url}/configs/test/data.json`));
  it('should serve fake i18n', () => axios.get(`${SERVER.url}/configs/test/i18n/fr.json`));
});
