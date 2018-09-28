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
    stream,
    maxBodyLength = 1000,
} = {}) => {
    app.use(addRequestId);
    app.use(morgan(function (tokens, req, res) {
        const logs = [];
        logs.push({
            __remark: 'BASIC',
            method: tokens.method(req, res),
            path: tokens.path(req, res),
            responseTime: tokens['response-time'](req, res) + 'ms',
            remoteAddress: tokens['remote-addr'](req, res),
            time: tokens.date(req, res, 'iso'),
            requestId: tokens['request-id'](req, res),
            responseStatus: tokens.status(req, res)
        });
        const query = tokens.query(req, res);
        if (query) {
            logs.push({
                __remark: 'QUERY',
                requestId: tokens['request-id'](req, res),
                ...query
            });
        }
        if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) {
            logs.push({
                __remark: 'BODY',
                requestId: tokens['request-id'](req, res),
                ...req.body
            });
        }
        return JSON.stringify(logs);
    }, {
        stream
    }));

    const _json = app.response.json;
    app.response.json = function (body) {
        _json.call(this, body);
        if (body && typeof body === 'object') {
            this.__morgan_body_response = JSON.stringify(body);
        }
    };
    app.use(morgan(function (tokens, req, res) {
        if (res.__morgan_body_response) {
            let isBodyCut = false;
            if (res.__morgan_body_response.length > maxBodyLength) {
                res.__morgan_body_response = res.__morgan_body_response.slice(0, maxBodyLength) + '\n...';
                isBodyCut = true;
            }
            let data = {data: res.__morgan_body_response};
            if (!isBodyCut) {
                try {
                    data = JSON.parse(data.data);
                } catch (e) {}
            }
            const log = {
                __remark: 'RESPONSE',
                requestId: tokens['request-id'](req, res),
                ...data
            };
            return JSON.stringify(log);
        }
    }, {
        stream
    }));
};
