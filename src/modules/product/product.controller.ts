import {
  Body,
  Controller,
  Get,
  Param,
  Put,
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

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
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
    return this.productService.update(id, updateProductDto, images);
  }
}
