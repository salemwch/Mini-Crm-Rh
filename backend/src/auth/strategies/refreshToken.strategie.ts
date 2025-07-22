import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(RefreshTokenStrategy.name);

  constructor() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      RefreshTokenStrategy.prototype.logger.error('JWT_REFRESH_SECRET is not defined');
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        
        (req: Request) => req?.cookies?.['refresh_token'],
        
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: any) {
    console.log('🍪 Cookies received in RefreshTokenStrategy:', req.cookies);

    const token = req.cookies?.['refresh_token'];
    this.logger.debug(`Validating refresh token: ${token ? 'token found' : 'no token found'}`);
    this.logger.debug(`Payload received in refresh token: ${JSON.stringify(payload)}`);

    if (!token) {
      RefreshTokenStrategy.prototype.logger.warn('Refresh token not found in cookies');
      throw new UnauthorizedException('Refresh token not found in cookies');
    }


    this.logger.log(`Refresh token successfully validated for user ID: ${payload?.sub || payload?.id}`);

    return {
      ...payload,
      refreshToken: token,
    };
  }
}
