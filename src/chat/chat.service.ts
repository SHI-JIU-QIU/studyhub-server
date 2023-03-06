import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {

    constructor(@InjectRepository(Chat) private readonly chat: Repository<Chat>, private readonly userService: UserService) { }

    async getHistoryMessage(myid: string, userId: string) {
        return await this.chat.find({
            where: [{ fromId: userId, toId: myid }, { fromId: myid, toId: userId }],
            order: { createTime: "ASC" }
        })

    }

    async getChatList(id: string) {
        const result = await this.chat.find({
            where: [{ fromId: id }, { toId: id }],
            order: {
                createTime: "ASC"
            }
        });
        console.log(result);

        const list = [...(result.map((item) => {
            return item.fromId
        })), ...(result.map((item) => {
            return item.toId
        }))]

        const chatList = new Set()
        list.forEach((item) => {
            chatList.add(item)
        })

        chatList.delete(id)
        console.log(chatList);
        const chatListInfo = Array.from(chatList).map(async (item: string) => {
            return await this.userService.findUserById(item)

        })

        return chatListInfo
    }



}
