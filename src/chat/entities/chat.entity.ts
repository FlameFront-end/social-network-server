import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne
} from 'typeorm'
import { MessageEntity } from './message.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity('chat')
export class ChatEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	user1Id: number

	@Column()
	user2Id: number

	@Column({ nullable: true })
	lastSenderId: number

	@Column({ nullable: true })
	lastSenderName: string

	@Column({ nullable: true })
	lastMessage: string

	@OneToMany(() => MessageEntity, message => message.chat)
	messages: MessageEntity[]

	@ManyToOne(() => UserEntity, user => user.chatsAsUser1)
	user1: UserEntity

	@ManyToOne(() => UserEntity, user => user.chatsAsUser2)
	user2: UserEntity

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
