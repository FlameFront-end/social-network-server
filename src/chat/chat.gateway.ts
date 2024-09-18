import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'socket.io'
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
			senderId: number
			receiverId: number
			content?: string
			audio?: ArrayBuffer
			replyToMessageId?: number
		}
	) {
		const chatId = await this.chatService.getChatId(
			message.senderId,
			message.receiverId
		)

		if (!chatId) {
			await this.chatService.createChat(message.senderId, message.receiverId)
		}

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
			chatId,
			audioUrl
		})

		const lastMessageContent = audioUrl
			? 'Голосовое сообщение'
			: message.content
		await this.chatService.updateLastMessage(chatId, lastMessageContent)

		const sender = await this.userService.findBuId(message.senderId)
		const receiver = await this.userService.findBuId(message.receiverId)

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
			audioUrl
		}

		this.server.emit('receiveMessage', messageWithUsers)

		const senderChats = await this.chatService.getAllChatsForUser(
			message.senderId
		)
		const receiverChats = await this.chatService.getAllChatsForUser(
			message.receiverId
		)

		this.server.to(`user_${message.senderId}`).emit('updateChats', senderChats)
		this.server
			.to(`user_${message.receiverId}`)
			.emit('updateChats', receiverChats)
	}

	@SubscribeMessage('join')
	handleJoinRoom(client: any, userId: number) {
		client.join(`user_${userId}`)
	}

	@SubscribeMessage('markAsRead')
	async handleMarkAsRead(
		@MessageBody()
		data: {
			receiverId: number
			senderId: number
			chatId: number
		}
	) {
		await this.chatService.markMessagesAsRead(data.receiverId, data.chatId)

		this.server
			.to(`user_${data.receiverId}`)
			.emit('messagesRead', { chatId: data.chatId })
		this.server
			.to(`user_${data.senderId}`)
			.emit('messagesRead', { chatId: data.chatId })
		this.server
			.to(`chat_${data.chatId}`)
			.emit('messagesRead', { chatId: data.chatId })
	}
}
