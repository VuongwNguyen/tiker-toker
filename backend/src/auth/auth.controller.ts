import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SuccessResponse } from './../util/reponses';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthRole } from './entities/auth.entity';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  async create(@Body() createAuthDto: CreateAuthDto) {
    const userCreated = await this.authService.create(createAuthDto);
    return new SuccessResponse({
      meta: userCreated,
      message: 'User created successfully',
      statusCode: 201,
    });
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() createAuthDto: CreateAuthDto) {
    const { authModel, tokens } = await this.authService.signIn(createAuthDto);
    return new SuccessResponse({
      meta: {
        user: authModel,
        tokens,
      },
      message: 'User signed in successfully',
      statusCode: 200,
    });
  }
 
  @UseGuards(RefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: any) {
    const tokens = await this.authService.refreshToken(req.user._id, req.cookies.refreshToken);
    return new SuccessResponse({
      meta: tokens,
      message: 'Tokens refreshed successfully',
      statusCode: 200,
    });
  }
  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(AuthRole.ADMIN, AuthRole.MODERATOR)
  // @Get('profile')
  // async getProfile(@Req() req: any) {
  //   const user = req.user; // Assuming user is set by a guard
  //   return new SuccessResponse({
  //     meta: user,
  //     message: 'User profile retrieved successfully',
  //     statusCode: 200,
  //   });
  // }
}
