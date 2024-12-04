import { InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { FileType } from '#types';

export function splitKeyAndValue(param: object) {
  const [key, value] = Object.entries(param)[0];

  if (!key || !value) {
    console.error('require key and value');
    throw new InternalServerErrorException();
  }

  return [key, value];
}

export function checkIfFolderExistAndCreate(bucket: string) {
  const uploadPath = path.join(process.cwd(), '@Upload');
  const filePath = path.join(uploadPath, bucket);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  return filePath;
}
