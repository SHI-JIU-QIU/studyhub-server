import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';



@Injectable()
export class EmailService {

  constructor(@InjectRedis() private readonly redis: Redis,@Inject('nodeEmail') private readonly nodeEmail:any) { }


  async sendEmail(email: string) {
    const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0')
    console.log(email, code);

    const mail = {
      from: `"studyhub"<918837256@qq.com>`,
      subject: 'studyhub验证码',
      to: email,
      html: `
          <p>您好！</p>
          <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
          <p>如果不是您本人操作，请无视此邮件</p>
      ` }
    let msg: string = ''
    await this.nodeEmail.sendMail(mail).then(async () => {
      msg = '验证码发送成功'
      await this.redis.set(email, code, 'EX', 100000);
    }).catch(() => {
      throw new HttpException('验证码发送失败 ', HttpStatus.BAD_REQUEST)
    })

    return msg

  };

  async validCaptcha(email: string, captcha: string) {

    if (captcha === await this.redis.get(email)) {
     return true
    }
    else {
      throw new HttpException('验证码不正确',HttpStatus.BAD_REQUEST)
    }

  }





}

