import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessageEntity } from './entities/message.entity'
import { ChatEntity } from './entities/chat.entity'
import { UserEntity } from '../user/entities/user.entity'

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

	async getChatInfoById(
		chatId: number,
		userId: number
	): Promise<{
		interlocutor: UserEntity
		messages: MessageEntity[]
	}> {
		const chat = await this.chatRepository.findOne({
			where: {
				id: chatId
			},
			relations: ['messages.sender', 'user1', 'user2']
		})

		const interlocutor = chat.user1Id === userId ? chat.user2 : chat.user1

		return {
			interlocutor,
			messages: chat ? chat.messages : []
		}
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
			relations: ['sender', 'replyToMessage', 'replyToMessage.sender']
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
			lastSenderId: senderId,
			updatedAt: new Date()
		})

		return await this.chatRepository.findOne({ where: { id: chatId } })
	}

	async getAllChatsByUserId(userId: number) {
		const chats = await this.chatRepository.find({
			where: [{ user1Id: userId }, { user2Id: userId }],
			relations: ['user1', 'user2'],
			order: { updatedAt: 'DESC' }
		})

		return await Promise.all(
			chats.map(async chat => {
				const unreadCount = await this.getUnreadMessagesCount(chat.id, userId)
				const interlocutor = chat.user1Id === userId ? chat.user2 : chat.user1

				delete chat.user2
				delete chat.user1

				return {
					...chat,
					unreadCount,
					interlocutor
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
