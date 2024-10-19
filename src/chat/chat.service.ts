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

	async createChat(senderId: number, receiverId: number): Promise<ChatEntity> {
		const newChat = this.chatRepository.create({
			user1Id: senderId,
			user2Id: receiverId
		})

		return await this.chatRepository.save(newChat)
	}
	async updateLastMessage(
		chatId: number,
		lastMessage: { senderId: number; senderName: string; content: string }
	) {
		await this.chatRepository.update(chatId, {
			lastMessage: lastMessage.content,
			lastSenderName: lastMessage.senderName,
			lastSenderId: lastMessage.senderId
		})

		return await this.chatRepository.findOne({ where: { id: chatId } })
	}

	async getAllChatsForUser(userId: number) {
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
