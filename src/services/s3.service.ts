import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET', {
      infer: true,
    }) as string;
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', {
          infer: true,
        }) as string,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          { infer: true },
        ) as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `https://${this.bucket}.s3.${this.configService.get<string>(
      'AWS_REGION',
      { infer: true },
    )}.amazonaws.com/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
