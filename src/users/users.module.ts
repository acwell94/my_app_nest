import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/common/utils/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
