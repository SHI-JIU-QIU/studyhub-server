import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { EmailModule } from './email/email.module';
import { DatabaseModule } from './common/database/database.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CommodityModule } from './commodity/commodity.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import REDISCONFIG from './config/redis.config';
import { AuthModule } from './auth/auth.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PartitionModule } from './partition/partition.module';
import { ChatModule } from './chat/chat.module';



@Module({
  imports: [RedisModule.forRoot({
    config: REDISCONFIG
  }),ConfigModule.forRoot({isGlobal:true}), DatabaseModule, UserModule, EmailModule, PostModule, CommentModule, CommodityModule, AuthModule, PartitionModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
