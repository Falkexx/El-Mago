import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SendProofToOrderItemBody } from './SendProofToOrdemItem.dto';
import { validateSync } from 'class-validator';

export const SendProofToOrder = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;
    const file = request.file;

    if (file.originalname.length > 100) {
      throw new BadRequestException('the name cannot be greater than 100');
    }

    const dtoInstance = plainToInstance(SendProofToOrderItemBody, body);

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
