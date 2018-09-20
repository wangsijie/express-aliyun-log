const ALI = require('aliyun-sdk');

class AliyunLogger {
    constructor(options) {
        this.options = options;
        this.sls = new ALI.SLS({
            accessKeyId: options.ak,
            secretAccessKey: options.sk,
            endpoint: options.endpoint,
            apiVersion: '2015-06-01'
        });
    }
    putLogs(project, store, topic, data = {}) {
        const logGroup = {
            logs : [{
                time:  Math.floor(new Date().getTime()/1000),
                contents: Object.keys(data).map(key => ({key, value: data[key]}))
            }],
            topic
        };
    
        const sls = this.sls;
    
        if (!sls) {
            return Promise.reject(new Error('Error configuration for Aliyun'));
        }
        
        return new Promise((resolve, reject) => {
            sls.putLogs({
                projectName: project,
                logStoreName: store,
                logGroup
            }, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = AliyunLogger;
