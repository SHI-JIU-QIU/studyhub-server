import { InjectRedis, } from '@liaoliaots/nestjs-redis';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {



  constructor(
    @InjectRedis() private readonly redis: Redis,
    public readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,) { }

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user)
  }

  async login(user: Partial<User>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
    });
    await this.redis.set(user.id, token, 'EX', 6 * 60 * 60)
    const userInfo =  await this.userService.findUserById(user.id)
    
    return { token ,userInfo}
  }
}
