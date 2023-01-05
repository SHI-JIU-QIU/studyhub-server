import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { AuthService } from 'src/auth/auth.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';


@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly user: Repository<User>,
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis) { }


  // 通过email查找用户
  async findUserByEmail(email: string) {
    return await this.user.find({
      where: {
        email: email
      }
    })
  }

  //验证email是否唯一
  async validEmail(email: string) {
    let result = await this.findUserByEmail(email)
    if (result.length === 0) {
      return true
    }
    else {
      throw new HttpException('邮箱已存在', HttpStatus.BAD_REQUEST)
    }
  }


  // 通过username查找用户
  async findUserByUsername(username: string) {
    return await this.user.find({
      where: {
        username: username
      }
    })
  }

  //通过id查找用户
  async findUserById(id: string) {
    return await this.user.findOne({
      where: {
        id: id
      }
    })
  }

  //验证用户名是否唯一
  async validUsername(username: string) {
    let result = await this.findUserByUsername(username)

    if (result.length === 0) {
      return true
    }
    else {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
    }

  }


  //注册用户
  async registerUser(username: string, password: string, email: string) {
    password = bcrypt.hashSync(password, 10)
    await this.user.save({ username, password, email })
    this.redis.del(email)
  }


  //验证两次密码是否一致
  async vaildConfirmPassword(password: string, confirmPassword: string): Promise<boolean> {

    if (password.trim() === confirmPassword.trim()) {
      return true
    }
    else {
      throw new HttpException('密码不一致', HttpStatus.BAD_REQUEST)
    }

  }

  //登录
  async login(username: string, password: string) {
    let result = await this.findUserByUsername(username)
    
    if (result.length === 0) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }
    else {
      if (bcrypt.compareSync(password, result[0].password)) {
        return this.authService.login({ id: result[0].id, username: result[0].username })
      }
      else {
        throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
      }
    }
  }


  async updateUser() {




  }





}
