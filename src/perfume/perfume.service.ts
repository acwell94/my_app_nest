// perfume.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfumeEntity } from './perfume.entity';
import { Repository } from 'typeorm';
import { CreatePerfumeDto } from './dto/createPerfume.dto';
import { S3Service } from '../common/utils/aws/s3.service';
import { UpdatePerfumeDto } from './dto/updatePerfume.dto';

@Injectable()
export class PerfumeService {
  constructor(
    @InjectRepository(PerfumeEntity)
    private readonly perfumeRepository: Repository<PerfumeEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async createPerfume(dto: CreatePerfumeDto, files: Express.Multer.File[]) {
    const imageUrls = await this.s3Service.uploadFiles(files);

    const perfume = this.perfumeRepository.create({
      ...dto,
      image: JSON.stringify(imageUrls), // 배열을 JSON 문자열로 저장
    });

    const savedPerfume = await this.perfumeRepository.save(perfume);

    return {
      message: '향수가 성공적으로 생성되었습니다.',
      item: savedPerfume,
    };
  }

  async updatePerfume(
    id: number,
    dto: UpdatePerfumeDto,
    files: Express.Multer.File[],
  ) {
    const perfume = await this.perfumeRepository.findOneBy({ perfumeId: id });
    if (!perfume) {
      throw new NotFoundException('존재하지 않는 향수입니다.');
    } else {
      const imageUrls = await this.s3Service.uploadFiles(files);
      await this.perfumeRepository.update(id, {
        ...dto,
        image: JSON.stringify(imageUrls),
      });

      return {
        message: '향수 정보가 성공적으로 업데이트되었습니다.',

        item: {
          ...dto,
          image: imageUrls,
        },
      };
    }
  }

  async deletePerfume(id: number) {
    const perfume = await this.perfumeRepository.findOneBy({ perfumeId: id });
    if (!perfume) {
      throw new NotFoundException('존재하지 않는 향수입니다.');
    } else {
      await this.perfumeRepository.delete(id);
      return {
        message: '향수가 성공적으로 삭제되었습니다.',
      };
    }
  }

  async getPerfume(id: number) {
    const perfume = await this.perfumeRepository.findOneBy({ perfumeId: id });
    if (!perfume) {
      throw new NotFoundException('존재하지 않는 향수입니다.');
    } else {
      return perfume;
    }
  }

  async getPerfumeList(category: string) {
    const perfumes = await this.perfumeRepository.find({
      where: { category },
    });
    return perfumes;
  }
}
