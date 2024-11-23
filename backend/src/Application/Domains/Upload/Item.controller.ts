import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateItem } from './CreateItem.decorator';
import { CreateItemDto } from './CrateItem.dto';

@Controller({ path: 'item', version: '1' })
export class ItemController {
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createProduct(@CreateItem() productDto: CreateItemDto) {
    console.log(productDto.image);
  }
}
