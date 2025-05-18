import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtHelperService } from 'src/common/utils/jwt/jwt-helper.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtHelper: JwtHelperService,
  ) {}
  async createUserByEmail(email: string, nickname: string, password: string) {
    // 기존 유저 찾기
    const existing = await this.userRepo.findOneBy({ email });
    // 기존 유저가 있을 경우 에러
    if (existing) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    // 토큰 발급
    const token = this.jwtHelper.signAccessToken(email, nickname);
    const refresh = this.jwtHelper.signRefreshToken(email, nickname);
    // 유저 테이블에 추가
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
      refresh_token: refresh,
    });
    await this.userRepo.save(user);

    return {
      email,
      nickname,
      accessToken: token,
      refreshToken: refresh,
    };
  }
  async duplicateCheckEmail(email: string) {
    const existing = await this.userRepo.findOneBy({ email });
    // 기존 유저가 있을 경우 에러
    if (existing) {
      return {
        message: '이미 존재하는 이메일입니다.',
      };
    } else {
      return {
        message: '회원 가입 가능한 이메일입니다.',
      };
    }
  }
  async signInByEmail(email: string, password: string) {
    try {
      const existing = await this.userRepo.findOneBy({ email });
      if (!existing) {
        throw new BadRequestException('가입된 이메일이 없습니다.');
      }
      const isValidPassword = await bcrypt.compare(password, existing.password);
      if (!isValidPassword) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }
      const token = this.jwtHelper.signAccessToken(email, existing.nickname);
      const refresh = this.jwtHelper.signRefreshToken(email, existing.nickname);
      await this.userRepo.update(existing.userId, {
        refresh_token: refresh,
      });
      return {
        email,
        nickname: existing.nickname,
        accessToken: token,
        refreshToken: refresh,
      };
    } catch (err) {
      throw new BadRequestException('알 수 없는 에러가 발생하였습니다.');
    }
  }
  async logout(email: string) {
    try {
      const existing = await this.userRepo.findOneBy({ email });
      if (!existing) {
        throw new BadRequestException('로그아웃 실패');
      }
      await this.userRepo.update(existing.userId, {
        refresh_token: '',
      });
      return {
        message: '로그아웃 성공',
      };
    } catch (err) {
      throw new BadRequestException('알 수 없는 에러가 발생하였습니다.');
    }
  }
}
