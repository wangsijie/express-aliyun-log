const logger = require('./app');
const Stream = require('./stream');

module.exports = (app, config = {
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: '',
    project: '',
    store: '',
    outputError: true,
    maxBodyLength,
    outputMode: 'standard',
}) => {
    const stream = new Stream(config);
    logger(app, {stream});
}
