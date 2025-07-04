import { SetMetadata } from '@nestjs/common';
import { AuthRole } from '../entities/auth.entity';
export const ROLES_KEY = 'roles';
export const Roles = (...role: AuthRole[]) => SetMetadata(ROLES_KEY, role);
