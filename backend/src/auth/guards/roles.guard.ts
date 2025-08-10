import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRole } from '../entities/auth.entity';
import { Auth } from '../entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AuthRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true; // Không cần phân quyền cụ thể

    const { user } = context.switchToHttp().getRequest();

    const queryUser = await this.authModel
      .findById(user._id)
      .select('role')
      .exec();

    if (!queryUser) return false; // Người dùng không tồn tại

    return requiredRoles.includes(queryUser.role); // So sánh role trong token
  }
}
