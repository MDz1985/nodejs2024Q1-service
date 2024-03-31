import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { WriteStream, createWriteStream, mkdir } from 'node:fs';
import * as process from 'process';

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

console.log('DEBUGf' in LogLevel);
const LOG_LEVEL = process.env.LOG_LEVEL in LogLevel ? process.env.LOG_LEVEL as unknown as LogLevel : LogLevel.INFO;
const LOG_FOLDER_PATH = process.env.LOG_FOLDER_PATH || './logs';


@Injectable()
export class LoggingService {
  constructor() {
    this.onInit();
  }

  private readonly logger = new Logger(LoggingService.name);
  private readonly logFileSizeLimit = (+process.env.LOG_FILE_SIZE_LIMIT || 1) * 1024;
  private logFileStream: WriteStream;

  private get filePath(): string {
    return `${ LOG_FOLDER_PATH }/${ new Date().toISOString() }.log`;
  }

  private logToFile(message: string, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `${ timestamp } [${ level }] ${ message }\n`;

    this.logFileStream.write(logMessage);

    if (this.logFileStream.bytesWritten >= this.logFileSizeLimit) {
      this.logFileStream.end();
      this.logFileStream.destroy();
      this.logFileStream.removeAllListeners();
      this.logFileStream = createWriteStream(this.filePath, { flags: 'a' });
    }
  }

  log(message: string) {
    switch (LOG_LEVEL) {
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

  // logRequest(request: any, response: any) {
  //   const logMessage = `Incoming request: ${request.url} - ${JSON.stringify(request.query)} - ${JSON.stringify(request.body)}`;
  //   this.log(logMessage, LogLevel.INFO);
  //
  //   const responseMessage = `Response: ${response.statusCode}`;
  //   this.log(responseMessage, LogLevel.INFO);
  // }

  logError(error: Error) {
    this.logger.error(error.message, error.stack);
  }

  private logLevel: LogLevel =
    LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] || LogLevel.ERROR;

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      process.stdout.write(`DEBUG: ${ message }\n`);

    }
  }

  error(message: string, stack) {
    process.stdout.write(`ERROR: ${ message }\n`);
  }

  private onInit() {
    mkdir(LOG_FOLDER_PATH, { recursive: true }, (err) => {
      if (err) throw err;
      createWriteStream(this.filePath, { flags: 'a' });
    });
  }
}
