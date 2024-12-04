import { Module } from '@nestjs/common';
import { S3Service } from './Providers/S3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class StorageModule {}
