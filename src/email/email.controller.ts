import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UserService } from 'src/user/user.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Get(':email')
  // async check(@Param('email') email: string) {
  //   const data = await this.userService.findUserByEmail(email);
  //   console.log(data);
  //   return data
  // }

  @Get('/sendEmail/:email')
  async sendEmail(@Param('email') email: string){
    console.log('sending........');
    
    const data = await this.emailService.sendEmail(email)
    console.log(data);
    
    return data
  }

}
