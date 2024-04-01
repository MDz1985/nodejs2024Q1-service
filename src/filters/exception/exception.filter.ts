import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { LoggingService } from '../../services/logging/logging.service';
import { LogLevel } from '../../common/enums/log-level';

@Catch()
export class CustomExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly _loggingService: LoggingService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : (exception as HttpException).getResponse()['message'];

    this._loggingService.logMessage(
      `HTTP ${status} Error: ${message}`,
      LogLevel.ERROR,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
