const express = require('express');
const logger = require('../src');

class LogStream {
    constructor() {
        this.data = [];
    }

    clear() {
        this.data = [];
    }

    write(chunk) {
        this.data.push(JSON.parse(chunk.toString()));
    }
}

module.exports = () => {
    const app = express();
    const stream = new LogStream();
    logger(app, { stream });

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.post('/post', function (req, res) {
        res.send('Post test success');
    });

    return {app, stream};
};
