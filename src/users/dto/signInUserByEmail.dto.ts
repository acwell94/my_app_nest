import { IsEmail, MinLength } from 'class-validator';

export class SignInUserByEmailDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
