const morgan = require('morgan');
const addRequestId = require('express-request-id')();

morgan.token('request-id', function (req, res) {
    return req.id;
});
morgan.token('path', function (req, res) {
    return req.path;
});
morgan.token('query', function (req, res) {
    return req.query;
});

module.exports = (app, {
    stream
} = {}) => {
    app.use(addRequestId);
    app.use(morgan(function (tokens, req, res) {
        const logs = [];
        logs.push({
            __remark: 'BASIC',
            method: tokens.method(req, res),
            path: tokens.path(req, res),
            query: tokens.query(req, res),
            responseTime: tokens['response-time'](req, res) + 'ms',
            remoteAddress: tokens['remote-addr'](req, res),
            time: tokens.date(req, res, 'iso'),
            requestId: tokens['request-id'](req, res),
            responseStatus: tokens.status(req, res),
        });
        if (req.body && typeof req.body === 'object') {
            logs.push({
                __remark: 'BODY',
                requestId: tokens['request-id'](req, res),
                ...req.body
            });
        }
        return JSON.stringify(logs, null, 4);
    }, {
        stream
    }));
};
