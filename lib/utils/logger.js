class Logger {
    constructor() {
        this.logLevel = 'info'; // Default log level
    }

    setLogLevel(level) {
        this.logLevel = level;
    }

    log(message) {
        console.log(this.formatMessage('LOG', message));
    }

    info(message) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('INFO', message));
        }
    }

    warn(message) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('WARN', message));
        }
    }

    error(message) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('ERROR', message));
        }
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString(); // UTC format
        return `[${timestamp}] [${level}] - ${message}`;
    }

    shouldLog(level) {
        const levels = ['error', 'warn', 'info'];
        return levels.indexOf(level) <= levels.indexOf(this.logLevel);
    }
}

export default new Logger();