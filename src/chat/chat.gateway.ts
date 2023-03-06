import { UseFilters } from '@nestjs/common';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { AllExceptionsFilter } from 'src/common/exceptions/base.exception.filter';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { Online, Message } from './type'
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { Socket } from 'socket.io';
import { extname, join } from 'path';
import { exit } from 'process';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e8
})
@UseInterceptors(TransformInterceptor)
@UseFilters(AllExceptionsFilter)

export class ChatGateway implements NestGateway {
  private userOnline: Online[];
  constructor(@InjectRepository(Chat) private readonly chat: Repository<Chat>, private readonly authService: AuthService) {
    this.userOnline = new Array<Online>()
  }


  @WebSocketServer()
  server: Server;

  afterInit() {
    this.server.use((client: any, next) => {
      client.user = this.authService.jwtService.verify(client.handshake.auth.token)
      next()
    })
  }

  handleConnection(client: any) {
    console.log('online-----------');

    console.log(client.id, client.user);
    let flag = 0
    this.userOnline.forEach(item => {
      if (item.userId === client.user.id) {
        item.socketId = client.id
        flag = 1
      }
    })
    if (flag === 0) {
      this.userOnline.push({ userId: client.user.id, socketId: client.id })
    }
    console.log(this.userOnline);
    console.log('------------------');
    console.log('///////当前连接数：', this.server.of('/').sockets.size);

    this.unReceivedMessage(client.id, client.user.id)


  };


  handleDisconnect(client: any) {
    console.log('disonline-----------', client.id, this.userOnline);
    const result = this.userOnline.find((item: Online) => {
      return item.socketId === client.id
    })

    console.log('//////////result', result);


    result.socketId = ''
    console.log(client.id, this.userOnline);

    console.log('-----------------');
  }


  //接受信息并返回给对应用户
  @SubscribeMessage('onMessage')
  async onMessage(@MessageBody() data: Message, @ConnectedSocket() client: any) {

    let message = null
    console.log(data);


    if (data.image) {
      let fileName = new Date().getTime() + '.jpg'
      fs.writeFile(join(__dirname, `../images/chat/${fileName}`), data.image, (err) => {
        console.log(err);
      })
      let imageUrl = `http://127.0.0.1:3000/images/chat/${fileName}`
      console.log(imageUrl);
      message = { image: imageUrl, toId: data.toId, fromId: client.user.id, isReceived: 0 }
    } else {
      message = { text: data.text, toId: data.toId, fromId: client.user.id, isReceived: 0 }
    }

    console.log(message);


    // await this.chat.save(message)

    const toSocketId = this.userOnline.find((item) => item.userId === data.toId)?.socketId
    //在线
    console.log(toSocketId);

    if (toSocketId) {
      //发送信息，监听结果，修改数据库
      this.sendMessage()(toSocketId, message)

    }

    return message
  }


  //发送消息
  sendMessage() {
    let time = 0
    const sendEvent = (clientId: string, message: any) => {
      this.server.timeout(10000).to(clientId).emit('sendMessage', message, async (err: any, res: any) => {
        if (err && time < 5) {
          setTimeout(() => {
            sendEvent(clientId, message)
            time++
          }, 2000)
        }
        else {
          this.chat.update({ id: message.id }, {
            isReceived: 1
          })
        }
      })
    }

    return sendEvent

  }

  //发送未接受的消息
  async unReceivedMessage(clientId: string, userId: string) {
    const result = await this.chat.find({
      where: {
        toId: userId,
        isReceived: 0
      }
    })

    result.forEach((item) => {
      this.sendMessage()(clientId, item)
    })
  }





}