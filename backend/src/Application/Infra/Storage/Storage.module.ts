import { Module } from '@nestjs/common';

import { StorageService } from './Storage.service';
import { StorageLocalProvider } from './Providers/Local.service';
import { StorageS3Provider } from './Providers/S3.service';

@Module({
  providers: [StorageService, StorageLocalProvider, StorageS3Provider],
  exports: [StorageService],
})
export class StorageModule {}
