import { Module } from '@nestjs/common';
import { ItemController } from './Item.controller';

@Module({
  controllers: [ItemController],
})
export class ItemModule {}
