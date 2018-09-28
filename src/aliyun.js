const ALI = require('aliyun-sdk');

class AliyunLogger {
    constructor(options = {}) {
        this.options = options;
        if (!options.accessKeyId) {
            throw new Error('Error configuration for Aliyun(accessKeyId)');
        }
        if (!options.secretAccessKey) {
            throw new Error('Error configuration for Aliyun(secretAccessKey)');
        }
        if (!options.endpoint) {
            throw new Error('Error configuration for Aliyun(endpoint)');
        }
        this.sls = new ALI.SLS({
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
            endpoint: options.endpoint,
            apiVersion: '2015-06-01'
        });
    }
    putLogs(project, store, topic, data = {}) {
        const logGroup = {
            logs : [{
                time:  Math.floor(new Date().getTime()/1000),
                contents: Object.keys(data).map(key => {
                    let value = data[key];
                    if (typeof value === 'object') {
                        try {
                            value = JSON.stringify(value);
                        } catch (e) {
                            value = String(value);
                        }
                    }
                    if (typeof value !== 'string') {
                        value = String(value);
                    }
                    return {
                        key,
                        value,
                    }
                })
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
