import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany
} from 'typeorm'
import { PostEntity } from './post.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity('comment')
export class CommentEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => UserEntity)
	user: UserEntity

	@Column()
	text: string

	@CreateDateColumn()
	createdAt: Date

	@ManyToOne(() => PostEntity, post => post.comments)
	post: PostEntity

	@OneToMany(() => CommentEntity, comment => comment.replyTo, { cascade: true })
	replies: CommentEntity[]

	@ManyToOne(() => CommentEntity)
	replyTo: CommentEntity
}
