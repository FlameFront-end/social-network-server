import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessageEntity } from './entities/message.entity'
import { ChatEntity } from './entities/chat.entity'

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>
	) {}

	async saveMessage(messageData: {
		senderId: number
		receiverId: number
		content: string
		chatId: number
		audioUrl?: string
	}) {
		const messageEntity = this.messageRepository.create(messageData)
		return await this.messageRepository.save(messageEntity)
	}

	async getMessageById(messageId: number): Promise<MessageEntity> {
		return this.messageRepository.findOne({
			where: { id: messageId },
			relations: [
				'sender',
				'receiver',
				'replyToMessage',
				'replyToMessage.sender',
				'replyToMessage.receiver'
			]
		})
	}

	async getMessagesBetweenUsers(userId1: number, userId2: number) {
		return await this.messageRepository.find({
			where: [
				{ senderId: userId1, receiverId: userId2 },
				{ senderId: userId2, receiverId: userId1 }
			],
			relations: [
				'sender',
				'receiver',
				'replyToMessage',
				'replyToMessage.sender',
				'replyToMessage.receiver'
			],
			order: { createdAt: 'ASC' }
		})
	}

	async getChatId(
		senderId: number,
		receiverId: number
	): Promise<number | null> {
		const chat = await this.chatRepository.findOne({
			where: [
				{ user1Id: senderId, user2Id: receiverId },
				{ user1Id: receiverId, user2Id: senderId }
			]
		})
		return chat ? chat.id : null
	}

	async createChat(senderId: number, receiverId: number): Promise<ChatEntity> {
		const newChat = this.chatRepository.create({
			user1Id: senderId,
			user2Id: receiverId
		})

		console.log('newChat', newChat)

		return await this.chatRepository.save(newChat)
	}

	async updateLastMessage(chatId: number, lastMessage: string) {
		await this.chatRepository.update(chatId, { lastMessage })
	}

	async getAllChatsForUser(userId: number) {
		return this.chatRepository.find({
			where: [{ user1Id: userId }, { user2Id: userId }],
			relations: [
				'messages',
				'messages.sender',
				'messages.receiver',
				'user1',
				'user2'
			],
			order: { updateAt: 'ASC' }
		})
	}
}
