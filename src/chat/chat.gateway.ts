import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { UserService } from '../user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { BadRequestException } from '@nestjs/common'
import * as Bytescale from '@bytescale/sdk'
import nodeFetch from 'node-fetch'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	constructor(
		private readonly chatService: ChatService,
		private readonly userService: UserService
	) {}

	private readonly uploadManager = new Bytescale.UploadManager({
		fetchApi: nodeFetch as any,
		apiKey: process.env.BYTESCALE_API_KEY
	})

	private connectedUsers: Record<number, string> = {}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const userId = Number(client.handshake.query.userId)
		if (userId) {
			this.connectedUsers[userId] = client.id
		}
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const userId = Object.keys(this.connectedUsers).find(
			key => this.connectedUsers[Number(key)] === client.id
		)
		if (userId) {
			delete this.connectedUsers[Number(userId)]
		}
	}

	async getSocketByUserId(userId: number): Promise<string | null> {
		return this.connectedUsers[userId] || null
	}

	@SubscribeMessage('send-message')
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
			const buffer = Buffer.from(message.audio)
			const fileName = `${uuidv4()}.webm`

			try {
				const { fileUrl } = await this.uploadManager.upload({
					data: buffer,
					mime: 'audio/webm',
					originalFileName: fileName
				})

				audioUrl = fileUrl
			} catch (error) {
				throw new BadRequestException(`Audio upload failed: ${error.message}`)
			}
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
			message.senderId,
			'senderName',
			lastMessageContent
		)

		let replyToMessage = null
		if (message.replyToMessageId) {
			replyToMessage = await this.chatService.getMessageById(
				message.replyToMessageId
			)
		}

		const messageWithUsers = {
			...savedMessage,
			replyToMessage,
			audioUrl,
			chatId: message.chatId
		}

		this.server.emit('receive-message', messageWithUsers)
		this.server.emit('update-chat', updateChat)

		const receiverSocket = await this.getSocketByUserId(message.receiverId)
		if (receiverSocket) {
			this.server.to(receiverSocket).emit('receive-message', messageWithUsers)
		}

		// Обновление количества непрочитанных сообщений
		// const unreadCount = await this.chatService.getUnreadMessagesCount(
		// 	message.chatId,
		// 	message.receiverId
		// )

		// if (receiverSocket) {
		// 	this.server.to(receiverSocket).emit('unread-messages-count', {
		// 		chatId: message.chatId,
		// 		unreadCount
		// 	})
		// }
	}

	@SubscribeMessage('message-read')
	async handleMessageRead(
		@MessageBody()
		{ messageId }: { messageId: number }
	) {
		const message = await this.chatService.getMessageById(messageId)

		if (message.isRead) return

		await this.chatService.markMessagesAsRead(messageId)
		const updatedMessage = await this.chatService.getMessageById(messageId)

		this.server.emit('message-read', updatedMessage)

		// const unreadCount = await this.chatService.getUnreadMessagesCount(
		// 	updatedMessage.chatId,
		// 	updatedMessage.receiverId
		// )
		//
		// const receiverSocket = await this.getSocketByUserId(message.receiverId)
		//
		// console.log('receiverSocket', receiverSocket)
		//
		// if (receiverSocket) {
		// 	this.server.to(receiverSocket).emit('unread-messages-count', {
		// 		chatId: message.chatId,
		// 		unreadCount
		// 	})
		// }
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

	@SubscribeMessage('typing-stopped')
	async handleTypingStopped(
		@MessageBody()
		body: {
			senderId: number
			chatId: number
		},
		@ConnectedSocket() client: Socket
	): Promise<void> {
		const sender = await this.userService.findOneById(body.senderId)

		client.broadcast.emit('typing-stopped', {
			senderName: sender.name,
			senderId: body.senderId,
			chatId: body.chatId
		})
	}
}
