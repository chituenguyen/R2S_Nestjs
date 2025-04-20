import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;
  private s3: S3;

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
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    try {
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
    } catch (error) {
      Logger.error(`Failed to upload file: ${error.message}`);
      return '';
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  }

  async deleteFile(imageUrl: string): Promise<void> {
    // Extract the key from the URL
    const key = this.getKeyFromUrl(imageUrl);
    if (!key) {
      throw new Error('Invalid image URL');
    }
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  private getKeyFromUrl(url: string): string {
    // Extract key from S3 URL
    // Example URL: https://bucket-name.s3.region.amazonaws.com/products/image.jpg
    // Returns: products/image.jpg
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/');
  }
}
