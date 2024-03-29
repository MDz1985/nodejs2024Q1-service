import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _jwtService: JwtService) {}
  use(req: Request, res: Response, next: () => void) {
    const authHeader = req.headers.get('Authorization');
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
