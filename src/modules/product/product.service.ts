import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.controller';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../../services/s3.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private s3Service: S3Service,
  ) {}

  public async findAll() {
    const data = await this.entityManager.query('SELECT * FROM products');
    return { data: data };
  }

  public async findOne(id: string) {
    const data = await this.entityManager.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    return { data: data };
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<void> {
    console.log(files);
    const { name, price, description } = updateProductDto;

    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let imageUrls: string[] = [];

    // Upload new images if provided
    if (files && files.length > 0) {
      try {
        // Delete old images from S3
        if (product.data[0].images && product.data[0].images.length > 0) {
          await Promise.all(
            product.data[0].images.map(async (imageUrl) => {
              try {
                await this.s3Service.deleteFile(imageUrl);
              } catch (error) {
                console.error(`Failed to delete image: ${imageUrl}`, error);
              }
            }),
          );
        }

        // Upload new images
        imageUrls = await Promise.all(
          files.map(async (file) => {
            // Validate file type
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
              throw new BadRequestException(
                `File type not allowed: ${file.originalname}`,
              );
            }

            // Generate unique filename
            const fileExtension = file.originalname.split('.').pop();
            const key = `products/${uuidv4()}.${fileExtension}`;

            // Upload to S3
            return await this.s3Service.uploadFile(file, key);
          }),
        );
      } catch (error) {
        // If upload fails, keep old images
        imageUrls = product.data[0].images || [];
        throw new Error(`Failed to upload images: ${error.message}`);
      }
    } else {
      // If no new files, keep existing images
      imageUrls = product.data[0].images || [];
    }

    await this.entityManager.query(
      'UPDATE products SET name = $1, price = $2, description = $3, images = $4 WHERE id = $5',
      [name, price, description, imageUrls, id],
    );
  }

  public async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<void> {
    const { name, price, description, category, brand } = createProductDto;

    let imageUrls: string[] = [];

    // Upload new images if provided
    if (files && files.length > 0) {
      try {
        imageUrls = await Promise.all(
          files.map(async (file) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
              throw new BadRequestException(
                `File type not allowed: ${file.originalname}`,
              );
            }

            // Generate unique filename
            const fileExtension = file.originalname.split('.').pop();
            const key = `products/${uuidv4()}.${fileExtension}`;

            // Upload to S3
            return await this.s3Service.uploadFile(file, key);
          }),
        );
      } catch (error) {
        throw new Error(`Failed to upload images: ${error.message}`);
      }
    }

    const product = await this.entityManager.query(
      'INSERT INTO products (name, price, description, images, category, brand) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, description, imageUrls, category, brand],
    );

    return product;
  }
}
