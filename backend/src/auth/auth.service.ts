import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorResponse } from 'src/util/reponses';
import { TokenService } from './token/token.service';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private readonly tokenService: TokenService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<Auth> {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.authModel.findOne({
      email: createAuthDto.email,
    });
    if (existingUser)
      throw new ErrorResponse({
        statusCode: 400,
        message: 'Email already exists',
      });

    const createdAuth = new this.authModel(createAuthDto);
    if (!createdAuth)
      throw new ErrorResponse({
        statusCode: 400,
        message: 'Failed to create new user',
      });

    await createdAuth.save();
    return createdAuth.toJSON();
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<{
    authModel: Auth;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Kiểm tra xem người dùng có
    const user = await this.authModel.findOne({ email: createAuthDto.email });

    if (!user) {
      throw new ErrorResponse({
        statusCode: 400,
        message: 'wrong email or password',
      });
    }
    // Kiểm tra mật khẩu (giả sử bạn đã hash mật khẩu khi tạo người dùng)
    if (!Bcrypt.compareSync(createAuthDto.password, user.password))
      throw new ErrorResponse({
        statusCode: 400,
        message: 'wrong email or password',
      });

    // Kiểm tra trạng thái của người dùng
    if (user.status === 'suspended')
      throw new ErrorResponse({
        statusCode: 403,
        message: 'Your account is suspended',
      });

    if (user.status === 'unverified')
      throw new ErrorResponse({
        statusCode: 403,
        message: 'Your account is unverified',
      });

    const tokens = this.tokenService.generateTokens({
      _id: <string>user._id,
    });
    // Cập nhật refresh token trong cơ sở dữ liệu
    user.currentRefreshToken = tokens.refreshToken;
    await user.save();

    return {
      authModel: user.toJSON(),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async refreshToken(
    _id: string,
    refreshToken: string,
  ): Promise<{ tokens: { accessToken: string; refreshToken: string } }> {
    const user = await this.authModel.findById(_id);
    if (!user) throw new ForbiddenException();

    if (user.currentRefreshToken !== refreshToken)
      throw new ForbiddenException('Invalid refresh token');
    // Kiểm tra trạng thái của người dùng
    if (user.status === 'suspended')
      throw new ForbiddenException('Your account has been suspended');
    if (user.status === 'unverified')
      throw new ForbiddenException('Your account is unverified');
    // Tạo lại token mới

    const tokens = this.tokenService.generateTokens({ _id: <string>user._id });
    user.currentRefreshToken = tokens.refreshToken;
    await user.save();
    return { tokens };
  }
}
