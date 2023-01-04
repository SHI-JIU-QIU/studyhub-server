import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [EmailService, {
    provide: 'nodeEmail',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return nodemailer.createTransport({
        service: 'qq', //类型qq邮箱
        port: 465,//上文获取的port
        secure: true,//上文获取的secure
        auth: {
          user: configService.get('EMAILUSER'), // 发送方的邮箱，可以选择你自己的qq邮箱
          pass: configService.get('EMAILPASS') // 上文获取的stmp授权码
        }
      })

    },
  }],
  exports: [EmailService]
})
export class EmailModule { }
