// token.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthRole } from '../entities/auth.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateTokens(payload: { _id: string; role: AuthRole }) {
    const accessToken = this.jwtService.sign(
      {
        _id: payload._id,
        role: payload.role,
      },
      {
        secret: this.config.get('ACCESS_JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        _id: payload._id,
      },
      {
        secret: this.config.get('REFRESH_JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.ACCESS_JWT_SECRET,
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.REFRESH_JWT_SECRET,
    });
  }
}
