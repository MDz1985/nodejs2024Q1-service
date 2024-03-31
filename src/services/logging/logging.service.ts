import { Injectable } from '@nestjs/common';

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

@Injectable()
export class LoggingService {
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
    console.log(JSON.stringify(message));
    process.stdout.write(`ERROR: ${ message }\n`);

  }
}
