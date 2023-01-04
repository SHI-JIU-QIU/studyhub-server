import { Module } from '@nestjs/common';
import { PartitionService } from './partition.service';
import { PartitionController } from './partition.controller';
import { Partition } from './entities/partition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';


@Module({
  imports: [TypeOrmModule.forFeature([Partition])],
controllers: [PartitionController],
  providers: [PartitionService]
})
export class PartitionModule { }
