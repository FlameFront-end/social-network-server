import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { ChatService } from './chat.service'
import { UserService } from '../user/user.service'

@WebSocketGateway({ cors: true })
export class ChatGateway {
	@WebSocketServer() server: Server

	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService
	) {}

	@SubscribeMessage('sendMessage')
	async handleMessage(
		@MessageBody()
		message: {
			senderId: number
			receiverId: number
			content: string
		}
	) {
		const chatId = await this.chatService.getChatId(
			message.senderId,
			message.receiverId
		)

		if (!chatId) {
			await this.chatService.createChat(message.senderId, message.receiverId)
			const chatId = await this.chatService.getChatId(
				message.senderId,
				message.receiverId
			)

			const savedMessage = await this.chatService.saveMessage({
				...message,
				chatId: chatId
			})

			await this.chatService.updateLastMessage(chatId, message.content)

			const sender = await this.userService.findOne(
				savedMessage.senderId.toString()
			)
			const receiver = await this.userService.findOne(
				savedMessage.receiverId.toString()
			)

			const messageWithUsers = {
				...savedMessage,
				sender,
				receiver
			}

			this.server.emit('receiveMessage', messageWithUsers)
		} else {
			const savedMessage = await this.chatService.saveMessage({
				...message,
				chatId: chatId
			})

			await this.chatService.updateLastMessage(chatId, message.content)

			const sender = await this.userService.findBuId(savedMessage.senderId)
			const receiver = await this.userService.findBuId(savedMessage.receiverId)

			const messageWithUsers = {
				...savedMessage,
				sender,
				receiver
			}

			this.server.emit('receiveMessage', messageWithUsers)
		}
	}
}
