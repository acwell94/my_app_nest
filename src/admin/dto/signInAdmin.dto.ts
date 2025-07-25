import { IsEmail, MinLength } from 'class-validator';

export class SignInAdminDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
