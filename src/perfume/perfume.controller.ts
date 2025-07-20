// perfume.controller.ts
import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  Res,
  Patch,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePerfumeDto } from './dto/createPerfume.dto';
import { PerfumeService } from './perfume.service';
import { Response } from 'express';
import { UpdatePerfumeDto } from './dto/updatePerfume.dto';

@Controller('perfumes')
export class PerfumeController {
  constructor(private readonly perfumeService: PerfumeService) {}

  @Post('/createPerfume')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreatePerfumeDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('hi2');
    console.log(files);
    return this.perfumeService.createPerfume(dto, files);
  }
  @Get('/getPerfume/:id')
  async getPerfume(@Param('id') id: number, @Res() res: Response) {
    const perfume = await this.perfumeService.getPerfume(id);
    res.json(perfume);
  }
  @Patch('/updatePerfume/:id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updatePerfume(
    @Param('id') id: number,
    @Body() dto: UpdatePerfumeDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('실행');
    return this.perfumeService.updatePerfume(id, dto, files);
  }
  @Delete('/deletePerfume/:id')
  async deletePerfume(@Param('id') id: number) {
    return this.perfumeService.deletePerfume(id);
  }
}
