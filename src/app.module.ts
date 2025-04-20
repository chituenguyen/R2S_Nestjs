import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RedisModule } from './modules/redis/redis.module';
import appConfig from './config/app.config';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.modules';
import { OrderModule } from './modules/order/order.modules';
import { OrderItemModule } from './modules/orderItem/orderItem.modules';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      ssl:
        process.env.DATABASE_SSL_ENABLED === 'true'
          ? {
              rejectUnauthorized:
                process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            }
          : false,
    }),
    // RedisModule,
    UserModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
    UploadModule,
  ],
})
export class AppModule {}
