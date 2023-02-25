import { SetMetadata } from '@nestjs/common';
import { Role } from './Entities/Role.enum';


export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);