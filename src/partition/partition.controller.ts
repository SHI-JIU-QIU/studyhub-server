import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UploadedFiles, HttpException, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PartitionService } from './partition.service';
import { CreatePartitionDto } from './dto/create-partition.dto';
import { UpdatePartitionDto } from './dto/update-partition.dto';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';


@Controller('partition')
export class PartitionController {
  constructor(private readonly partitionService: PartitionService) { }


  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async createPartition(@UploadedFile() avatar: Express.Multer.File, @Body() body: CreatePartitionDto, @Req() req: Request) {
    if (!avatar) {
      throw new HttpException('未上传头像', HttpStatus.BAD_REQUEST)
    }
    else {
      if (await (await this.partitionService.findPartitionByPartitionName(body.partitionName)).length > 0) {
        throw new HttpException('分区名已存在', HttpStatus.BAD_REQUEST)
      }
      else {
        return this.partitionService.createPartition(avatar, body.partitionName, req.headers.host)
      }
    }
  }


  @Post('vote')
  @UseGuards(AuthGuard('jwt'))
  async votePartition(@Req() req, @Body('partitionId') partitionId) {
    console.log(req.user);
    return await this.partitionService.votePartition(req.user.id, partitionId)

  }




}
