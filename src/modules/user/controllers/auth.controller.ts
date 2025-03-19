import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { Role } from '../enums/role.enum';
import { Request } from 'express';
import { Delete, Param } from '@nestjs/common';

@Controller('auth')
// @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Post('update-profile')
  updateProfile(
    @Req() req: Request,
    @Body()
    updateData: { firstname?: string; lastname?: string; address?: string },
  ) {
    const user = req.user as { id: number };
    return this.authService.updateProfile(user.id, updateData);
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

  @Get('users')
  getUsers() {
    return this.authService.getAllUsers();
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(Number(id));
  }

  @Delete('delete-all')
  deleteAllUsers() {
    return this.authService.deleteAllUsers();
  }
}
