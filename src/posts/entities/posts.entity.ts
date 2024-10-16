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
import { CommentsEntity } from './comments.entity'

@Entity('posts')
export class PostsEntity {
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

	@OneToMany(() => CommentsEntity, comment => comment.post, { cascade: true })
	comments: CommentsEntity[]

	@CreateDateColumn()
	createdAt: Date
}
