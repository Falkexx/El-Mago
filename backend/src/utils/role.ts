import { SetMetadata } from '@nestjs/common';

export enum ROLE {
  ADMIN = 'ADMIN',
  AFFILIATE = 'AFFILIATE',
  USER = 'USER',
}

export const ROLES_METADATA = 'roles';

export const RolesDecorator = (...roles: ROLE[]) =>
  SetMetadata(ROLES_METADATA, roles);
