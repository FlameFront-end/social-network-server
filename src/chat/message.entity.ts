import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from 'typeorm'

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	senderId: number

	@Column()
	receiverId: number

	@Column()
	content: string

	@CreateDateColumn()
	createdAt: Date
}
