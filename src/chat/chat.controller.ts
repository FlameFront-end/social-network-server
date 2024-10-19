import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Request,
	UseGuards
} from '@nestjs/common'
import { ChatService } from './chat.service'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post('/create')
	@UseGuards(JwtAuthGuard)
	createChat(@Request() req, @Body() body: { user2Id: number }) {
		return this.chatService.createChat(req.user.id, body.user2Id)
	}

	@Get('/my-chats')
	@UseGuards(JwtAuthGuard)
	getAllChats(@Request() req) {
		return this.chatService.getAllChatsByUserId(req.user.id)
	}

	@Get('/:chatId/messages')
	async getChatMessagesById(@Param('chatId') chatId: string) {
		return await this.chatService.getChatMessagesById(+chatId)
	}
}
