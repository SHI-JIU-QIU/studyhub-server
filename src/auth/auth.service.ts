import { InjectRedis, } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService) { }

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user)
  }

  async login(user: Partial<User>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
    });

    await this.redis.set(user.id, token, 'EX', 6 * 60 * 60)

    return { token }
  }
}
