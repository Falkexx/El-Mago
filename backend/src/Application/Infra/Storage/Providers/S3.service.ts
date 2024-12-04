import { env } from '#utils';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

export interface ImageUploadService {
  file: Express.Multer.File;
  name: string;
  bucket: string;
  mimetype: string;
}

@Injectable()
export class S3Service {
  private readonly S3 = new AWS.S3({
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY_ID,
  });

  async upload({ file, name, bucket }: ImageUploadService) {
    return this.s3Upload(file.buffer, bucket, name, file.mimetype);
  }

  private async s3Upload(
    fileBuffer: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params: PutObjectRequest = {
      Bucket: bucket,
      Key: String(name),
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.S3.upload(params).promise();

      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
