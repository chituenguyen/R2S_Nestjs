import { Module, OnModuleInit } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UploadModule } from '../../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements OnModuleInit {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async onModuleInit() {}
}
