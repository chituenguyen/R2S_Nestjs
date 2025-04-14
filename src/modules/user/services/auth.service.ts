import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, UpdateProfileDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = this.entityManager.create(User, {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        address: registerDto.address,
      });

      await this.entityManager.save(user);

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error: any) {
      Logger.error(error);
      throw new BadRequestException('Failed to register');
    }
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.entityManager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.entityManager.query(
        'UPDATE users SET name = $1, address = $2 WHERE id = $3',
        [updateProfileDto.name, updateProfileDto.address, userId],
      );

      return {
        message: 'Profile updated successfully',
        user: user,
      };
    } catch (error: any) {
      Logger.error(error);
      return {
        message: 'Failed to update profile',
        error: error.message,
      };
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.entityManager.findOne(User, {
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens: tokens, user: user };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.entityManager.update(User, userId, { refresh_token: undefined });
  }

  async getProfile(userId: number) {
    try {
      const user = await this.entityManager.findOne(User, {
        where: { id: userId },
      });
      return user;
    } catch (error: any) {
      Logger.error(error);
      return {
        message: 'Failed to get profile',
        error: error.message,
      };
    }
  }

  private async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.entityManager.update(User, userId, {
      refresh_token: hashedRefreshToken,
    });
  }
}
