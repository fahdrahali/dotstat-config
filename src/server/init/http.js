const debug = require('../debug');
const getUrl = server => `http://${server.address().address}:${server.address().port}`;

const init = ctx => {
  const {
    app,
    config: {
      server: { host = 'localhost', port },
    },
  } = ctx;
  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, err => {
      if (err) return reject(err);
      const url = getUrl(server);
      debug.info(`Server started on ${url}`);
      server.url = url;
      return resolve({ ...ctx, httpServer: server });
    });
  });
};

module.exports = init;
