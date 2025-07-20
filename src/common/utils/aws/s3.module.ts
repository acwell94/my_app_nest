import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service], // 👈 다른 모듈에서도 사용하려면 반드시 export!
})
export class S3Module {}
