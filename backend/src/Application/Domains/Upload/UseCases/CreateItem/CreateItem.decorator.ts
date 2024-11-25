import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { validateSync } from 'class-validator';
import { CreateItemBodyDto } from './CrateItem.dto';

export const CreateItem = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;
    const file = request.file;

    const dtoInstance = plainToInstance(CreateItemBodyDto, body);

    const errors = validateSync(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return {
      ...dtoInstance,
      image: file,
    };
  },
);
