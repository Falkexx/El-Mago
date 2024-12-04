import { env } from '#utils';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { FileUploadProps } from '../Storage.service';

@Injectable()
export class StorageS3Provider {
  private readonly S3 = new AWS.S3({
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY_ID,
  });

  async s3Upload(fileUploadProps: FileUploadProps) {
    const params: PutObjectRequest = {
      Bucket: fileUploadProps.bucket,
      Key: String(fileUploadProps.name),
      Body: fileUploadProps.file.buffer,
      ACL: 'public-read',
      ContentType: fileUploadProps.mimetype,
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
