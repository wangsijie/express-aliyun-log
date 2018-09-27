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
        const data = stream.data;
        let query;
        data.forEach(item => {
            if (item.__remark === 'QUERY') {
                query = item;
            }
        });
        assert.equal(typeof query, 'object');
        assert.equal(query.foo, 'bar');
        assert.equal(query.foz, 'baz');
    });
    it('包含BASIC', () => {
        const data = stream.data;
        let basic;
        data.forEach(item => {
            if (item.__remark === 'BASIC') {
                basic = item;
            }
        });
        assert.equal(typeof basic, 'object');
    });

    describe('POST类型', function() {
        before(() => {
            stream.clear();
        });
        it('200 OK', done => {
            request(app)
                .post('/post?foo=bar&foz=baz')
                .send({foo: 'bar'})
                .expect(200, done);
        });
        it('path正确', () => {
            assert.equal(stream.data[0].path, '/post');
        });
        it('query正确', () => {
            const data = stream.data;
            let query;
            data.forEach(item => {
                if (item.__remark === 'QUERY') {
                    query = item;
                }
            });
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
        });
        it('包含BASIC', () => {
            const data = stream.data;
            let basic;
            data.forEach(item => {
                if (item.__remark === 'BASIC') {
                    basic = item;
                }
            });
            assert.equal(typeof basic, 'object');
        });
        it('得到post data，参数foo=bar', () => {
            const data = stream.data;
            let body;
            data.forEach(item => {
                if (item.__remark === 'BODY') {
                    body = item;
                }
            });
            assert.equal(typeof body, 'object');
            assert.equal(body.foo, 'bar');
        });
        it('得到response data，foo=bar', () => {
            const data = stream.data;
            let response;
            data.forEach(item => {
                if (item.__remark === 'RESPONSE') {
                    response = item;
                }
            });
            assert.equal(typeof response, 'object');
            assert.equal(response.foo, 'bar');
        });
    });
});