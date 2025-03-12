import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './modules/redis/redis.module';
import appConfig from './config/app.config';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.modules';
import { OrderModule } from './modules/order/order.modules';
import { OrderItemModule } from './modules/orderItem/orderItem.modules';

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
      port: parseInt(process.env.DATABASE_PORT || '3366'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),
    RedisModule,
    UserModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
  ],
})
export class AppModule {}
