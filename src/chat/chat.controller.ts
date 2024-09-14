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
	createChat(@Request() req, @Body() body: { receiverId: number }) {
		return this.chatService.createChat(req.user.id, body.receiverId)
	}

	@Get(':userId1/:userId2')
	getMessagesBetweenUsers(
		@Param('userId1') userId1: string,
		@Param('userId2') userId2: string
	) {
		return this.chatService.getMessagesBetweenUsers(
			Number(userId1),
			Number(userId2)
		)
	}

	@Get('/my-chats')
	@UseGuards(JwtAuthGuard)
	getAllChats(@Request() req) {
		return this.chatService.getAllChatsForUser(req.user.id)
	}
}
