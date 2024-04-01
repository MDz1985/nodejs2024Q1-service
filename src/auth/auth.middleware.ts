import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { LoggingService } from '../services/logging/logging.service';
import { LogLevel } from '../common/enums/log-level';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _loggingService: LoggingService
  ) {}
  use(req: Request, res: Response, next: () => void) {
    const requestMessage = `Request: METHOD=${req.method} URL=${req.url} QUERY=${JSON.stringify(req.query)} BODY=${JSON.stringify(req.body)}`;
    this._loggingService.logMessage(requestMessage, LogLevel.INFO);
    res.on('finish', () => {
      const responseMessage = `Response: STATUS=${res.statusCode}`;
      this._loggingService.logMessage(responseMessage, LogLevel.INFO);
    });

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    try {
      req['user'] = this._jwtService.verify(token);
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
