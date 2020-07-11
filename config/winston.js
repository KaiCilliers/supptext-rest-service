/**
 * Dependencies
 */
const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');

/**
 * Logging Transports
 */
const options = {
  combined_log: {
    filename: `${appRoot}/logs/combined.log`,
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  },
  error_log: {
    filename: `${appRoot}/logs/errors.log`,
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  },
  exception_log: {
    filename: `${appRoot}/logs/exceptions.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  },
  rejection_log: {
    filename: `${appRoot}/logs/rejections.log`,
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
};

/**
 * Instantiate a new Winston Logger
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.prettyPrint()
  ),
  defaultMeta: {
    service: 'supptext-messenger-service'
  },
  /**
     * Setup Transports
     */
  transports: [
    new transports.File(options.error_log),
    new transports.File(options.combined_log)
  ],
  exceptionHandlers: [
    new transports.File(options.exception_log)
  ],
  rejectionHandlers: [
    new transports.File(options.rejection_log)
  ],
  exitOnError: false // do not exit on handled exceptions
});
if (process.env.NODE_ENV !== 'production') {
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
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message, encoding);
  }
};

/**
 * Exports
 */
module.exports = logger;
