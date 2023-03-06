import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./chat.service";




@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('historymessage/:id')
    @UseGuards(AuthGuard('jwt'))
    async getHistoryMessage(@Req() req, @Param('id') userId) {
        return await this.chatService.getHistoryMessage(req.user.id,userId);
    }

    @Get('chatlist')
    @UseGuards(AuthGuard('jwt'))
    async getChatList(@Req() req) {
        const result = await this.chatService.getChatList(req.user.id)
        const chatInfo = await Promise.all(result)
        return chatInfo
    }
}
