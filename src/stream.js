const AliyunLogger = require('./aliyun');

class LogStream {
    constructor(options = {}) {
        this.options = options;
        if (!options.project) {
            throw new Error('Error configuration for Aliyun(project)');
        }
        if (!options.store) {
            throw new Error('Error configuration for Aliyun(store)');
        }
        this.options.outputError = options.hasOwnProperty('outputError') ? options.outputError : false;
        this.options.outputMode = options.hasOwnProperty('outputMode') ? options.outputMode : 'standard';
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

    async putLog(log) {
        if (this.options.outputMode === 'standard') {
            const {project, store} = this.options;
            try {
                const {__remark} = log;
                delete log.__remark;
                await this.logger.putLogs(project, store, __remark, log);
            } catch (e) {
                if (this.options.outputError) {
                    console.log(e);
                }
            }
        } else if (this.options.outputMode === 'console') {
            console.log(log);
        }
    }
}

module.exports = LogStream;
