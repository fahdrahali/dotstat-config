const pino = require('pino');
const pinoms = require('pino-multi-stream');
const prettifier = require('pino-pretty');
const stackdriver = require('pino-stackdriver');

const options = {
  name: 'config',
};

const prettyStream = pinoms.prettyStream({
  prettyPrint: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'hostname,pid',
  },
  prettifier,
});

const level =  process.env.NODE_ENV === 'test' ? 'silent' : process.env.LOGGING_LEVEL || 'info';
const streams = [{ level, stream: prettyStream }];

if (process.env.LOGGING_DRIVER === 'gke') {
  const projectId = process.env.LOGGING_PROJECT_ID;
  const logName = process.env.LOGGING_LOGNAME;
  const stackDriverStream = stackdriver.createWriteStream({
    projectId,
    logName,
    resource: {
      type: 'global',
      labels: {
        app: 'config',
      },
    },
  });
  streams.push({ level, stream: stackDriverStream});
}

module.exports = pino(options, pinoms.multistream(streams));
