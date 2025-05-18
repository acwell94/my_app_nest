import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserByEmailDto } from './dto/createUserByEmail.dto';
import { Response } from 'express';
import { SignInUserByEmailDto } from './dto/signInUserByEmail.dto';
import { LogoutDto } from './dto/logout.dto';
import { CheckEmailDto } from './dto/checkEmail.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  test() {
    console.log(process.env.DATABASE_PORT);
  }
  @Post('/emailSignUp')
  async createUserByEmail(
    @Body() createUserDto: CreateUserByEmailDto,
    @Res() res: Response,
  ) {
    const { email, nickname, password } = createUserDto;
    const signUpResult = await this.usersService.createUserByEmail(
      email,
      nickname,
      password,
    );
    res.cookie('refreshToken', signUpResult.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      email: signUpResult.email,
      nickname: signUpResult.nickname,
      accessToken: signUpResult.accessToken,
    });
  }
  @Post('/emailSignIn')
  async signInByEmail(
    @Body() signInUserByEmail: SignInUserByEmailDto,
    @Res() res: Response,
  ) {
    const { email, password } = signInUserByEmail;
    const signInResult = await this.usersService.signInByEmail(email, password);
    res.cookie('refreshToken', signInResult.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      email: signInResult.email,
      nickname: signInResult.nickname,
      accessToken: signInResult.accessToken,
    });
  }
  @Post('/logout')
  async logout(@Body() logout: LogoutDto, @Res() res: Response) {
    const { email } = logout;
    const logoutResult = await this.usersService.logout(email);
    res.cookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.json({
      message: logoutResult.message,
    });
  }
  @Post('/checkEmail')
  async checkEmail(@Body() checkEmail: CheckEmailDto, @Res() res: Response) {
    const { email } = checkEmail;
    const checkEmailResult = await this.usersService.duplicateCheckEmail(email);
    return res.json({
      message: checkEmailResult.message,
    });
  }
}
