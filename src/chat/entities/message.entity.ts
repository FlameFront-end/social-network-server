import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn
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

	@Column({ default: null })
	content: string

	@Column({ default: null })
	audioUrl?: string

	@Column()
	chatId: number

	@Column({ nullable: true })
	replyToMessageId: number

	@CreateDateColumn()
	createdAt: Date

	@ManyToOne(() => UserEntity, user => user.sentMessages)
	sender: UserEntity

	@ManyToOne(() => UserEntity, user => user.receivedMessages)
	receiver: UserEntity

	@ManyToOne(() => ChatEntity, chat => chat.messages)
	chat: ChatEntity

	@ManyToOne(() => MessageEntity)
	@JoinColumn({ name: 'replyToMessageId' })
	replyToMessage: MessageEntity
}
