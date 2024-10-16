import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany
} from 'typeorm'
import { PostsEntity } from './posts.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity('comments')
export class CommentsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => UserEntity)
	user: UserEntity

	@Column()
	text: string

	@CreateDateColumn()
	createdAt: Date

	@ManyToOne(() => PostsEntity, post => post.comments)
	post: PostsEntity

	@OneToMany(() => CommentsEntity, comment => comment.replyTo, {
		cascade: true
	})
	replies: CommentsEntity[]

	@ManyToOne(() => CommentsEntity)
	replyTo: CommentsEntity
}
