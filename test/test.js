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
        request(app).get('/get?foo=bar&foz=baz').expect(200, done);
    });
    it('得到log', () => {
        assert(stream.data.length > 0);
    });
    it('path正确', () => {
        assert.equal(stream.data[0].path, '/get');
    });
    it('query正确', () => {
        const query = stream.data[0].query;
        assert.equal(typeof query, 'object');
        assert.equal(query.foo, 'bar');
        assert.equal(query.foz, 'baz');
    });

    describe('POST类型', function() {
        before(done => {
            stream.clear();
            request(app)
                .post('/post?foo=bar&foz=baz')
                .send({foo: 'bar'})
                .expect(200, done);
        });
        // it('得到3条log', () => {
        //     assert.equal(stream.data.length, 3);
        // });
        it('path正确', () => {
            assert.equal(stream.data[0].path, '/post');
        });
        it('query正确', () => {
            const query = stream.data[0].query;
            assert.equal(typeof query, 'object');
            assert.equal(query.foo, 'bar');
            assert.equal(query.foz, 'baz');
        });
        it('requestId一致', () => {
            const data = stream.data;
            assert(data[0].requestId);
            const requestId = data[0].requestId;
            data.forEach(item => {
                assert(item.requestId, requestId);
            });
            console.log(data);
        });
    });
});