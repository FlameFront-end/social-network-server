import { Controller, Get, Param } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

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
}
