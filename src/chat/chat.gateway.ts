import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { UserService } from '../user/user.service'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'

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
			chatId: number
			senderId: number
			receiverId: number
			content?: string
			audio?: ArrayBuffer
			replyToMessageId?: number
		}
	) {
		let audioUrl = null
		if (message.audio) {
			const dirPath = path.join(__dirname, '../..', 'uploads', 'voice')

			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true })
			}

			const buffer = Buffer.from(message.audio)
			const fileName = `${uuidv4()}.webm`
			const filePath = path.join(dirPath, fileName)

			await fs.promises.writeFile(filePath, buffer)

			audioUrl = `http://localhost:3000/uploads/voice/${fileName}`
		}

		const savedMessage = await this.chatService.saveMessage({
			...message,
			chatId: message.chatId,
			audioUrl
		})

		const lastMessageContent = audioUrl
			? 'Голосовое сообщение'
			: message.content

		const updateChat = await this.chatService.updateLastMessage(
			message.chatId,
			lastMessageContent
		)

		const sender = await this.userService.findOneById(message.senderId)
		const receiver = await this.userService.findOneById(message.receiverId)

		let replyToMessage = null
		if (message.replyToMessageId) {
			replyToMessage = await this.chatService.getMessageById(
				message.replyToMessageId
			)
		}

		const messageWithUsers = {
			...savedMessage,
			sender,
			receiver,
			replyToMessage,
			audioUrl,
			chatId: message.chatId
		}

		this.server.emit('receiveMessage', messageWithUsers)
		this.server.emit('updateChat', updateChat)
	}

	@SubscribeMessage('messageRead')
	async handleMessageRead(
		@MessageBody()
		{ messageId }: { messageId: number }
	) {
		const message = await this.chatService.getMessageById(messageId)

		if (message.isRead) return

		await this.chatService.markMessagesAsRead(messageId)
		const updatedMessage = await this.chatService.getMessageById(messageId)

		this.server.emit('messageReadUpdate', updatedMessage)
	}
	@SubscribeMessage('typing')
	async handleTyping(
		@MessageBody()
		body: {
			senderId: number
			chatId: number
		},
		@ConnectedSocket() client: Socket
	): Promise<void> {
		const sender = await this.userService.findOneById(body.senderId)

		client.broadcast.emit('typing', {
			senderName: sender.name,
			senderId: body.senderId,
			chatId: body.chatId
		})
	}

	@SubscribeMessage('typingStopped')
	async handleTypingStopped(
		@MessageBody()
		body: {
			senderId: number
			chatId: number
		},
		@ConnectedSocket() client: Socket
	): Promise<void> {
		const sender = await this.userService.findOneById(body.senderId)

		client.broadcast.emit('typingStopped', {
			senderName: sender.name,
			senderId: body.senderId,
			chatId: body.chatId
		})
	}
}
