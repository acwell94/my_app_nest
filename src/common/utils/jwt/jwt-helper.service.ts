import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtHelperService {
  constructor(private readonly configService: ConfigService) {}

  signAccessToken(email: string, nickname: string): string {
    const payload = { email, nickname };
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';

    if (!secret) throw new Error('JWT_SECRET is not defined');

    const options: jwt.SignOptions = {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    };

    const token = jwt.sign(payload, secret, options); // ✅ TS 오버로드 해결
    return token;
  }
  signRefreshToken(email: string, nickname: string): string {
    const payload = { email, nickname };
    const refresh = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    if (!refresh) throw new Error('JWT_Refresh is not defined');
    const options: jwt.SignOptions = {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    };
    const refreshToken = jwt.sign(payload, refresh, options);
    return refreshToken;
  }
  verifyAccessToken(token: string): any {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not defined');
    return jwt.verify(token, secret);
  }
  verifyRefreshToken(refreshToken: string): any {
    const refresh = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refresh) throw new Error('JWT_Refresh is not defined');
    return jwt.verify(refreshToken, refresh);
  }
}
