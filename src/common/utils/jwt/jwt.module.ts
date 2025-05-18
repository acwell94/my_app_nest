import { Module } from '@nestjs/common';
import { JwtHelperService } from './jwt-helper.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JwtHelperService],
  exports: [JwtHelperService],
})
export class JwtModule {}
