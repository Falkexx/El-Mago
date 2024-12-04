import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StorageLocalProvider } from './Providers/Local.service';
import { env } from '#utils';
import { StorageS3Provider } from './Providers/S3.service';
import { FileType } from '#types';

export interface FileUploadProps {
  file: Express.Multer.File;
  type: FileType;
  name: string;
  bucket: string;
  mimetype: string;
}

@Injectable()
export class StorageService {
  constructor(
    private readonly storageLocalProvider: StorageLocalProvider,
    private readonly storageS3Provider: StorageS3Provider,
  ) {}

  async upload(fileProps: FileUploadProps) {
    switch (env.STORAGE_PROVIDER) {
      case 'LOCAL':
        return this.storageLocalProvider.saveLocal(fileProps);

      case 'S3':
        return this.storageS3Provider.s3Upload(fileProps);
      default:
        throw new InternalServerErrorException('Require storage provider');
    }
  }
}
