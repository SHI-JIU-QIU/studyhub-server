import { ConfigService } from '@nestjs/config';
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly userService: UserService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('SECRET'),
            passReqToCallback: true,
        } as StrategyOptions);
    }

    async validate(req: any, tokenUser: User) {
        const redisToken = await this.redis.get(tokenUser.id)
        const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  
        
        // console.log(originToken,redisToken );
        if (redisToken != originToken) {
            throw new UnauthorizedException('您账户已经在另一处登陆，请重新登陆')
        }

        if (redisToken) {
            const user = await this.userService.findUserById(tokenUser.id)
            if (!user) {
                throw new UnauthorizedException('token不正确')
            }

            await this.redis.set(tokenUser.id, this.authService.createToken(tokenUser), 'EX', 6 * 60 * 60)

            return user
        }
        else {
            throw new UnauthorizedException('token已过期')
        }


    }
}