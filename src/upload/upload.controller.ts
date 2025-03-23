import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../services/s3.service';
import { v4 as uuidv4 } from 'uuid'; // Install this: npm install uuid @types/uuid

@Controller('uploads')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type if needed
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const key = `uploads/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const url = await this.s3Service.uploadFile(file, key);

    return { url, key };
  }

  @Get(':key')
  async getFile(@Param('key') key: string) {
    const url = await this.s3Service.getSignedUrl(`uploads/${key}`);
    return { url };
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile(`uploads/${key}`);
    return { message: 'File deleted successfully' };
  }
}
