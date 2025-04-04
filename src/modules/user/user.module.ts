import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Module, OnModuleInit } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
// import * as bcrypt from 'bcrypt';
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
    // create admin user
    // const hashedPassword = await bcrypt.hash('admin', 10);
    // await this.entityManager.query(
    //   'INSERT INTO users (email, password, roles) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
    //   ['admin@gmail.com', hashedPassword, '{ADMIN}'],
    // );
  }
}
