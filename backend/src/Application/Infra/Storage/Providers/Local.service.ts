import { checkIfFolderExistAndCreate, env } from '#utils';
import * as path from 'path';
import * as fs from 'fs';
import { StorageResult } from '#types';
import { Injectable } from '@nestjs/common';
import { FileUploadProps } from '../Storage.service';

@Injectable()
export class StorageLocalProvider {
  async saveLocal({
    file,
    name,
    bucket,
  }: FileUploadProps): Promise<StorageResult> {
    const dir = checkIfFolderExistAndCreate(bucket);

    const filePath = path.join(dir, name);

    fs.writeFileSync(filePath, file.buffer);

    const result: StorageResult = {
      Bucket: bucket,
      ETag: '',
      Key: name,
      Location: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/static/assets/${name}`,
    };

    return result;
  }
}
