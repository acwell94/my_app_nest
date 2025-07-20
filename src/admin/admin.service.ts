import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtHelperService } from 'src/common/utils/jwt/jwt-helper.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtHelper: JwtHelperService,
  ) {}
  async createAdmin(email: string, password: string) {
    const admin = await this.adminRepo.findOneBy({ email });
    if (admin) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = this.jwtHelper.signAccessToken(email, 'admin');
    const refresh = this.jwtHelper.signRefreshToken(email, 'admin');
    const user = this.adminRepo.create({
      email,
      password: hashedPassword,
      refresh_token: refresh,
    });
    await this.adminRepo.save(user);
    return {
      email,
      accessToken: token,
      refreshToken: refresh,
    };
  }
  async duplicateCheckEmail(email: string) {
    const existing = await this.adminRepo.findOneBy({ email });
    if (existing) {
      return {
        message: '이미 사용중인 이메일입니다.',
      };
    } else {
      return {
        message: '회원 가입 가능한 이메일입니다.',
      };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const admin = await this.adminRepo.findOneBy({ email });
      if (!admin) {
        throw new BadRequestException('존재하지 않는 이메일입니다.');
      }
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }
      const token = this.jwtHelper.signAccessToken(email, 'admin');
      const refresh = this.jwtHelper.signRefreshToken(email, 'admin');
      await this.adminRepo.update(admin.userId, { refresh_token: refresh });
      return {
        email,
        accessToken: token,
        refreshToken: refresh,
      };
    } catch (error) {
      throw new BadRequestException('알 수 없는 에러가 발생하였습니다.');
    }
  }

  async logout(email: string) {
    try {
      const admin = await this.adminRepo.findOneBy({ email });
      if (!admin) {
        throw new BadRequestException('로그아웃 실패');
      }
      await this.adminRepo.update(admin.userId, { refresh_token: '' });
      return {
        message: '로그아웃 성공',
      };
    } catch (error) {
      throw new BadRequestException('알 수 없는 에러가 발생하였습니다.');
    }
  }

  async deleteAccount(email: string, password: string) {
    try {
      const admin = await this.adminRepo.findOneBy({ email });
      if (!admin) {
        throw new BadRequestException('존재하지 않는 계정입니다.');
      }
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }
      await this.adminRepo.delete(admin.userId);
      return {
        message: '회원탈퇴가 완료되었습니다.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('알 수 없는 에러가 발생하였습니다.');
    }
  }
}
