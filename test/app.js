const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../src/app');

class LogStream {
    constructor() {
        this.data = [];
    }

    clear() {
        this.data = [];
    }

    write(chunk) {
        const data = JSON.parse(chunk.toString());
        if (Array.isArray(data)) {
            data.forEach(item => this.data.push(item));
        } else {
            this.data.push(data);
        }
    }
}

module.exports = () => {
    const app = express();
    const stream = new LogStream();
    app.use(bodyParser.json());
    logger(app, { stream });

    app.get('/get', function (req, res) {
        res.send('Hello World!');
    });

    app.post('/post', function (req, res) {
        res.json({
            foo: 'bar'
        });
    });

    return {app, stream};
};
