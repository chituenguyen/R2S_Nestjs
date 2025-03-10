import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Module, OnModuleInit } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class UserModule implements OnModuleInit {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async onModuleInit() {
    await this.entityManager.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        roles TEXT[] NOT NULL DEFAULT ARRAY['USER']::TEXT[],
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
}
