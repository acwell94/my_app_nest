import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfumeEntity } from './perfume.entity';
import { PerfumeService } from './perfume.service';
import { PerfumeController } from './perfume.controller';
import { S3Module } from '../common/utils/aws/s3.module'; // ⬅ 경로 주의

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfumeEntity]),
    S3Module, // ⬅ 반드시 추가!
  ],
  providers: [PerfumeService],
  controllers: [PerfumeController],
})
export class PerfumeModule {}
