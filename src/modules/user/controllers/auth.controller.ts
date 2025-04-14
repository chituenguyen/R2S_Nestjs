import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Put,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, UpdateProfileDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { Role } from '../enums/role.enum';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };
    return this.authService.updateProfile(user.id, updateProfileDto);
  }

  @Post('refresh')
  refreshTokens(@Body() body: { refreshToken: string }, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.authService.refreshTokens(user.id, body.refreshToken);
  }

  @Roles(Role.ADMIN)
  @Get('admin-only')
  adminOnly() {
    return 'Only admins can see this';
  }

  @Get('protected')
  protected() {
    return 'You must be logged in to see this';
  }
}
