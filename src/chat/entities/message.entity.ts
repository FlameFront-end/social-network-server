import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { ChatEntity } from './chat.entity'

@Entity('message')
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	senderId: number

	@Column()
	receiverId: number

	@Column()
	content: string

	@Column()
	chatId: number

	@CreateDateColumn()
	createdAt: Date

	@ManyToOne(() => UserEntity, user => user.sentMessages)
	sender: UserEntity

	@ManyToOne(() => UserEntity, user => user.receivedMessages)
	receiver: UserEntity

	@ManyToOne(() => ChatEntity, chat => chat.messages)
	chat: ChatEntity
}
