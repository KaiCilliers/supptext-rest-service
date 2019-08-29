/**
 * Dependencies
 */
const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');

/**
 * Logging options
 */
const options = {
    file : {
        filename: `${appRoot}/logs/app.log`,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    },
    console: {
        level: 'debug',
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
        handleExceptions: true
    }
}

/**
 * Instantiate a new Winston Logger
 */
let logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: {
        service: 'supptext-messenger-service'
    },
    /**
     * Setup Transports
     */
    transports: [
        new transports.File(options.file)
    ],
    exitOnError: false // do not exit on handled exceptions
});
if(process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(
        options.console
    ));
}

/**
 * Define a stream for `morgan`-related output to
 * be recorded in `winston` log files.
 * 
 * The `write` function will be used by `morgan`
 */
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    }
}

/**
 * Exports
 */
module.exports = logger;