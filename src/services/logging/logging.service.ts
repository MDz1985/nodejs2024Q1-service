import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream, mkdir, WriteStream } from 'node:fs';
import * as process from 'process';
import { LogLevel } from '../../common/enums/log-level';

const LOG_LEVEL =
  process.env.LOG_LEVEL in LogLevel
    ? LogLevel[process.env.LOG_LEVEL]
    : LogLevel.INFO;
const LOG_FOLDER_PATH = process.env.LOG_FOLDER_PATH || './logs';
console.log(LOG_LEVEL, 'LOG_LEVEL');
@Injectable()
export class LoggingService {
  constructor() {
    this.onInit();
  }

  private readonly logger = new Logger(LoggingService.name);
  private readonly logFileSizeLimit =
    (+process.env.LOG_FILE_SIZE_LIMIT_IN_KB || 1) * 1024;
  private logFileStream: WriteStream;

  private get filePath(): string {
    return `${LOG_FOLDER_PATH}/${new Date().toISOString()}.log`;
  }

  private logToFile(message: string, level = LogLevel.INFO) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${LogLevel[level]}] ${message}\n`;

    this.logFileStream.write(logMessage);

    if (this.logFileStream.bytesWritten >= this.logFileSizeLimit) {
      this.logFileStream.end();
      this.logFileStream.destroy();
      this.logFileStream.removeAllListeners();
      this.logFileStream = createWriteStream(this.filePath, { flags: 'a' });
    }
  }

  logMessage(message: string, level = LogLevel.INFO) {
    if (LOG_LEVEL <= level) {
      this.log(message, level);
      // todo: remove after the end of the project;
      process.stdout.write(message + '\n');
      this.logToFile(message, level);
    }
  }

  log(message: string, level: LogLevel) {
    switch (level) {
      case LogLevel.INFO:
        this.logger.log(message);
        break;
      case LogLevel.DEBUG:
        this.logger.debug(message);
        break;
      case LogLevel.ERROR:
        this.logger.error(message);
        break;
      default:
        this.logger.log(message);
        break;
    }
  }

  private onInit() {
    mkdir(LOG_FOLDER_PATH, { recursive: true }, (err) => {
      if (err) throw err;
      this.logFileStream = createWriteStream(this.filePath, { flags: 'a' });
    });
  }
}
