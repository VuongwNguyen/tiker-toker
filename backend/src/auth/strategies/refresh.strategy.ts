import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: RefreshStrategy.extractJWTFromCookie,
      secretOrKey: config.get('REFRESH_JWT_SECRET')!,
      passReqToCallback: true,
    });
  }
  private static extractJWTFromCookie(req: Request): string | null {
    return req?.cookies?.refreshToken || null;
  }

  async validate(req: Request, payload: any) {
    return { _id: payload._id };
  }
}
