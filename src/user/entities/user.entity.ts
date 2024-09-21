import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany
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

	@Column({ nullable: true })
	shortInfo: string

	@Column({ nullable: true })
	city: string

	@Column({ nullable: true })
	mobilePhone: string

	@Column({ nullable: true })
	additionalPhone: string

	@Column({ nullable: true })
	skype: string

	@Column({ nullable: true })
	site: string

	@Column({ nullable: true })
	activity: string

	@Column({ nullable: true })
	interests: string

	@Column({ nullable: true })
	music: string

	@Column({ nullable: true })
	movies: string

	@Column({ nullable: true })
	TVShows: string

	@Column({ nullable: true })
	games: string

	@Column({ nullable: true })
	quotes: string

	@Column({ type: 'json', default: [] })
	grandparents: string[]

	@Column({ type: 'json', default: [] })
	parents: string[]

	@Column({ type: 'json', default: [] })
	siblings: string[]

	@Column({ type: 'json', default: [] })
	children: string[]

	@Column({ type: 'json', default: [] })
	grandsons: string[]

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
