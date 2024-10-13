import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	ManyToMany
} from 'typeorm'
import { MessageEntity } from '../../chat/entities/message.entity'
import { ChatEntity } from '../../chat/entities/chat.entity'
import { UserDetailsEntity } from './user-details.entity' // импортируем новую сущность

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

	@OneToOne(() => UserDetailsEntity, { cascade: true, eager: false })
	@JoinColumn()
	details: UserDetailsEntity

	@ManyToMany(() => MessageEntity, message => message.sender)
	sentMessages: MessageEntity[]

	@ManyToMany(() => MessageEntity, message => message.receiver)
	receivedMessages: MessageEntity[]

	@ManyToMany(() => ChatEntity, chat => chat.user1)
	chatsAsUser1: ChatEntity[]

	@ManyToMany(() => ChatEntity, chat => chat.user2)
	chatsAsUser2: ChatEntity[]

	@Column({ type: 'json', default: [] })
	outgoingFriendRequests: number[]

	@Column({ type: 'json', default: [] })
	incomingFriendRequests: number[]

	@Column({ type: 'json', default: [] })
	friends: number[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
