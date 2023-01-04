import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, ClassSerializerInterceptor, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { LoginDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService, private readonly emailService: EmailService) { }


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    await this.userService.validUsername(createUserDto.username)

    await this.userService.vaildConfirmPassword(createUserDto.password, createUserDto.confirmPassword)

    await this.emailService.validCaptcha(createUserDto.email, createUserDto.captcha)

    return await this.userService.registerUser(createUserDto.username, createUserDto.password, createUserDto.email)

  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.username, loginDto.password)
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  async getUserInfo(@Req() req) {
    // console.log(req);
    return req.user
  }

  @Put('update')
  async update(@Body() updateUserDto:UpdateUserDto){
    
    


  }



}
