const AliyunLogger = require('./aliyun');

class LogStream {
    constructor(options) {
        this.options = options;
        this.logger = new AliyunLogger(options);
    }

    write(chunk) {
        const data = JSON.parse(chunk.toString());
        if (Array.isArray(data)) {
            data.forEach(item => this.putLog(item));
        } else {
            this.putLog(data);
        }
    }

    putLog(log) {
        const {project, store} = this.options;
        this.logger.putLogs(project, store, '', log);
    }
}

module.exports = LogStream;
