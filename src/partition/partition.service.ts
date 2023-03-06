import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartitionDto } from './dto/create-partition.dto';
import { UpdatePartitionDto } from './dto/update-partition.dto';
import { Partition } from './entities/partition.entity';
import * as fs from 'fs'
import { extname, join } from 'path';
import { DataSource } from "typeorm";
import { User } from 'src/user/entities/user.entity';



@Injectable()
export class PartitionService {


  constructor(@InjectRepository(Partition) private readonly partition: Repository<Partition>,
    private readonly dataSource: DataSource) { }



  async createPartition(avatar: Express.Multer.File, partitionName: string, host: string) {

    let fileName = new Date().getTime() + extname(avatar.originalname)

    fs.writeFile(join(__dirname, `../images/partition/${fileName}`), avatar.buffer, (err) => {
      console.log(err);
    })

    let avatarUrl = `http://${host}/images/partition/${fileName}`
    return this.partition.save({ avatarUrl, partitionName })

  }



  //关注
  async followPartition(userId: string, partitionId: string) {


    const partition = new Partition()
    const user = new User()
    partition.id = partitionId
    user.id = userId
    partition.users = [user]
    await this.dataSource.manager.save(partition)

  }

  async unFollowPartition(userId: string, partitionId: string) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        id: userId
      },
      relations: {
        partitions: true,
    },
    })
    console.log(user.partitions);
    
    user.partitions = user.partitions.filter((partition) => {
      return partition.id !== partitionId
    })
    await this.dataSource.manager.save(user)

  }


  //查找分区
  async findPartitionByPartitionName(partitionName: string) {
    return await this.partition.find({
      where: {
        partitionName
      }
    })
  }
}
