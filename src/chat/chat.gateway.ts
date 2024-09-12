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
			content: string
		}
	) {
		const chatId = await this.chatService.getChatId(
			message.senderId,
			message.receiverId
		)

		if (!chatId) {
			await this.chatService.createChat(message.senderId, message.receiverId)
		}

		const savedMessage = await this.chatService.saveMessage({
			...message,
			chatId
		})

		await this.chatService.updateLastMessage(chatId, message.content)

		const sender = await this.userService.findBuId(message.senderId)
		const receiver = await this.userService.findBuId(message.receiverId)

		const messageWithUsers = {
			...savedMessage,
			sender,
			receiver
		}

		this.server.emit('receiveMessage', messageWithUsers)
	}

	@SubscribeMessage('voice-message')
	async handleVoiceMessage(
		@MessageBody()
		message: {
			audio: ArrayBuffer
			senderId: number
			receiverId: number
			content: string | null
		}
	) {
		const chatId = await this.chatService.getChatId(
			message.senderId,
			message.receiverId
		)

		if (!chatId) {
			await this.chatService.createChat(message.senderId, message.receiverId)
		}

		const buffer = Buffer.from(message.audio)

		const fileName = `${uuidv4()}.webm`
		const filePath = path.join(__dirname, '../..', 'uploads', 'voice', fileName)

		await fs.promises.writeFile(filePath, buffer)

		const audioUrl = `http://localhost:3000/uploads/voice/${fileName}`

		const savedMessage = await this.chatService.saveMessage({
			senderId: message.senderId,
			receiverId: message.receiverId,
			content: message.content,
			chatId,
			audioUrl
		})

		await this.chatService.updateLastMessage(chatId, 'Voice message')

		const sender = await this.userService.findBuId(message.senderId)
		const receiver = await this.userService.findBuId(message.receiverId)

		const messageWithUsers = {
			...savedMessage,
			sender,
			receiver,
			audioUrl
		}

		this.server.emit('receiveMessage', messageWithUsers)
	}
}
