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

	async createChat(user1Id: number, user2Id: number): Promise<ChatEntity> {
		const newChat = this.chatRepository.create({ user1Id, user2Id })
		return await this.chatRepository.save(newChat)
	}

	async getChatMessagesById(chatId: number): Promise<MessageEntity[]> {
		const chat = await this.chatRepository.findOne({
			where: {
				id: chatId
			},
			relations: ['messages.sender', 'messages.receiver']
		})

		return chat ? chat.messages : []
	}

	async saveMessage(messageData: {
		senderId: number
		receiverId: number
		chatId: number
		content?: string
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

	async updateLastMessage(
		chatId: number,
		senderId: number,
		senderName: string,
		content: string
	) {
		await this.chatRepository.update(chatId, {
			lastMessage: content,
			lastSenderName: senderName,
			lastSenderId: senderId
		})

		return await this.chatRepository.findOne({ where: { id: chatId } })
	}

	async getAllChatsByUserId(userId: number) {
		const chats = await this.chatRepository.find({
			where: [{ user1Id: userId }, { user2Id: userId }],
			relations: [
				'messages',
				'messages.sender',
				'messages.receiver',
				'user1',
				'user2'
			],
			order: { updateAt: 'DESC' }
		})

		return await Promise.all(
			chats.map(async chat => {
				const unreadCount = await this.getUnreadMessagesCount(chat.id, userId)
				return {
					...chat,
					unreadCount
				}
			})
		)
	}

	async markMessagesAsRead(messageId: number): Promise<void> {
		await this.messageRepository.update(messageId, { isRead: true })
	}

	async getUnreadMessagesCount(
		chatId: number,
		userId: number
	): Promise<number> {
		return this.messageRepository.count({
			where: {
				chatId,
				receiverId: userId,
				isRead: false
			}
		})
	}
}
