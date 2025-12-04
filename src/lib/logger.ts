// Structured logging utility
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    userId?: string;
    requestId?: string;
    [key: string]: any;
}

class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = 'info') {
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }

    private log(level: LogLevel, message: string, context?: LogContext) {
        if (!this.shouldLog(level)) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...context
        };

        // In production, send to logging service (e.g., Datadog, LogRocket)
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to logging service
            console.log(JSON.stringify(logEntry));
        } else {
            console.log(`[${level.toUpperCase()}]`, message, context || '');
        }
    }

    debug(message: string, context?: LogContext) {
        this.log('debug', message, context);
    }

    info(message: string, context?: LogContext) {
        this.log('info', message, context);
    }

    warn(message: string, context?: LogContext) {
        this.log('warn', message, context);
    }

    error(message: string, context?: LogContext) {
        this.log('error', message, context);
    }
}

export const logger = new Logger(
    (process.env.LOG_LEVEL as LogLevel) || 'info'
);
