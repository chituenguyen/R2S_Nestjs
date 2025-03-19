import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsEmail()
  firstname: string;

  @IsEmail()
  lastname: string;

  @IsEmail()
  address: string;

  @IsString()
  @MinLength(6)
  password: string;
}
