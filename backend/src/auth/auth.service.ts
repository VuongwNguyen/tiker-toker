import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth, AuthRole } from './entities/auth.entity';
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

    return createdAuth;
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<{
    authModel: Auth;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Kiểm tra xem người dùng có
    const user = await this.authModel.findOne({ email: createAuthDto.email });

    if (!user) {
      throw new ErrorResponse({
        statusCode: 404,
        message: 'wrong email or password',
      });
    }
    console.log(user);
    // Kiểm tra mật khẩu (giả sử bạn đã hash mật khẩu khi tạo người dùng)
    if (!Bcrypt.compareSync(createAuthDto.password, user.password))
      throw new ErrorResponse({
        statusCode: 400,
        message: 'wrong email or password',
      });

    // Tạo và trả về token
    // Giả sử bạn đã có một service để tạo token
    const tokens = this.tokenService.generateTokens({
      _id: <string>user._id,
      role: user.role!,
    });

    return {
      authModel: user.toJSON(),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }
}
