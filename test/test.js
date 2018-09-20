const assert = require('assert');
const request = require('supertest');
const getApp = require('./app');

let app;
let stream;
before(() => {
    const {app: _app, stream: _stream} = getApp();
    app = _app;
    stream = _stream;
});

describe('测试APP返回正常', function() {
    before(done => {
        stream.clear();
        request(app).get('/').expect(200, done);
    });
    it('得到log', () => {
        assert(stream.data.length > 0);
    });
    it('requestId一致', () => {
        const data = stream.data;
        assert(data[0].requestId);
        const requestId = data[0].requestId;
        data.forEach(item => {
            assert(item.requestId, requestId);
        });
    });

    describe('POST类型', function() {
        it('200 OK', done => {
            request(app)
                .post('/post')
                .send({foo: 'bar'})
                .expect(200, () => {
                    // console.log(stream.data);
                    done();
                });
        });
    });
});