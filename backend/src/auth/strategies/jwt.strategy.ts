import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload._id)
      throw new UnauthorizedException('Invalid token payload');

    const user = await this.authModel
      .findById(payload._id)
      .select('status')
      .exec();
    if (!user) throw new UnauthorizedException();
    if (user.status === 'suspended')
      throw new ForbiddenException('Your account has been suspended');

    return { _id: payload._id };
  }
}
