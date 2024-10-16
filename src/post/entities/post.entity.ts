import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
	ManyToMany,
	JoinTable
} from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { CommentEntity } from './comment.entity'

@Entity('post')
export class PostEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'json', default: [] })
	files: string[]

	@Column({ nullable: true })
	description: string

	@ManyToOne(() => UserEntity, user => user.posts)
	creator: UserEntity

	@ManyToMany(() => UserEntity)
	@JoinTable()
	likes: UserEntity[]

	@OneToMany(() => CommentEntity, comment => comment.post, { cascade: true })
	comments: CommentEntity[]

	@CreateDateColumn()
	createdAt: Date
}
