import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';

export interface UpdateProductDto {
  name: string;
  price: number;
  description: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
}
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get('search')
  async search(@Query('name') name: string) {
    return await this.productService.search(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return await this.productService.update(id, updateProductDto, images);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 images
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return await this.productService.create(createProductDto, images);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
