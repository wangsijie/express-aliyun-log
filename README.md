# express-aliyun-log

阿里云日志服务的express中间件，快速配置express应用接入[阿里云日志服务](https://help.aliyun.com/product/28958.html)

## 基本用法

```js
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('express-aliyun-log');

const app = express();
app.use(bodyParser.json());
logger(app, options);   // options见下文说明

app.get('/get', function (req, res) {
    res.send('Hello World!');
});

app.post('/post', function (req, res) {
    res.json({
        foo: 'bar'
    });
});


```

## 配置

```js
const options = {
    accessKeyId: 'LTAxxxxxxxxd62',
    secretAccessKey: '09r8xxxxxxxxxxxoFKeC',
    endpoint: 'http://us-west-1.log.aliyuncs.com',  // 见下面的详细说明
    project: 'projectName', // 日志服务的project
    store: 'storeName',   // 日志服务的store
    outputError: false, // 是否显示日志推送失败的错误消息，默认false,
    maxBodyLength: 1000,    // 最大的body长度，默认1000字符（response)
    outputMode: 'standard', // 日志输出模式，standard默认，向阿里云日志服务提交，可选debug，由console显示，none不显示
}
```

[查看endpoint列表](https://www.alibabacloud.com/help/zh/doc-detail/29008.htm)

## 记录值

一次请求最多可能包含4条日志，用topic区分，并且拥有相同的requestId
1. BASIC 基本的请求记录
2. QUERY 链接上的参数，为方便索引，单独拉出一条
3. BODY 请求body，需要自行通过bodyParser等中间件解析，没有的话不记录
4. RESPONSE 请求的返回值

```
__source__:  
__topic__:  BASIC
method:  POST
path:  /post
remoteAddress:  ::ffff:127.0.0.1
requestId:  cf71e53c-86bb-4c2d-9b94-61cdc6aca8f8
responseStatus:  200
responseTime:  2.137ms
time:  2018-09-28T07:08:10.544Z

__source__:  
__topic__:  BODY
foo:  bar
nested:  {"foz":"baz"}
requestId:  cf71e53c-86bb-4c2d-9b94-61cdc6aca8f8

__source__:  
__topic__:  QUERY
foo:  bar
foz:  baz
requestId:  cf71e53c-86bb-4c2d-9b94-61cdc6aca8f8

__source__:  
__topic__:  RESPONSE
foo:  bar
requestId:  cf71e53c-86bb-4c2d-9b94-61cdc6aca8f8
```

## License

MIT © [Wang Sijie](http://sijie.wang)
