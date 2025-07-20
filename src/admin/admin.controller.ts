import { Body, Controller, Post, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Response } from 'express';
import { SignInAdminDto } from './dto/signInAdmin.dto';
import { LogoutDto } from './dto/logout.dto';
import { CheckEmailDto } from './dto/checkEmail.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('/emailSignUp')
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response,
  ) {
    const { email, password } = createAdminDto;
    const signUpResult = await this.adminService.createAdmin(email, password);
    res.cookie('refreshToken', signUpResult.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      email: signUpResult.email,
      accessToken: signUpResult.accessToken,
    });
  }
  @Post('/emailSignIn')
  async signIn(@Body() signInAdminDto: SignInAdminDto, @Res() res: Response) {
    const { email, password } = signInAdminDto;
    const signInResult = await this.adminService.signIn(email, password);
    res.cookie('refreshToken', signInResult.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      email: signInResult.email,
      accessToken: signInResult.accessToken,
    });
  }
  @Post('/logout')
  async logout(@Body() logout: LogoutDto, @Res() res: Response) {
    const { email } = logout;
    const logoutResult = await this.adminService.logout(email);
    res.clearCookie('refreshToken', {
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
    const checkEmailResult = await this.adminService.duplicateCheckEmail(email);
    return res.json({
      message: checkEmailResult.message,
    });
  }
}
