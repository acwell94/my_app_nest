import { IsEmail, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
