import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm'
import { MessageEntity } from '../../chat/entities/message.entity'
import { ChatEntity } from '../../chat/entities/chat.entity'

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column()
	password: string

	@Column()
	surname: string

	@Column()
	name: string

	@Column({ nullable: true })
	patronymic: string

	@Column({ nullable: true })
	birthdate: string

	@Column({ nullable: true })
	ava: string

	@Column({ default: false })
	isAdmin: boolean

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToMany(() => MessageEntity, message => message.sender)
	sentMessages: MessageEntity[]

	@OneToMany(() => MessageEntity, message => message.receiver)
	receivedMessages: MessageEntity[]

	@OneToMany(() => ChatEntity, chat => chat.user1)
	chatsAsUser1: ChatEntity[]

	@OneToMany(() => ChatEntity, chat => chat.user2)
	chatsAsUser2: ChatEntity[]
}
