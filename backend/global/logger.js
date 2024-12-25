const winston = require('winston');
const dotenv = require('dotenv');
const { combine, timestamp, json } = winston.format;
dotenv.config();
const logger = winston.createLogger({
    level: process.env.WINSTON_LOG_LEVEL || 'info',
    format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
      ),
      transports: [new winston.transports.File({
        filename: 'app_logging.log',
      }),
      new winston.transports.File({
        filename: 'app-error.log',
        level: 'error',
      }),
    ],
      
  });

  module.exports = logger;