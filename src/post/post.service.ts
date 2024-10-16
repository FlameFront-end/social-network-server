import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostEntity } from './entities/post.entity'
import { CommentEntity } from './entities/comment.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UserEntity } from '../user/entities/user.entity'

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(PostEntity)
		private readonly postRepository: Repository<PostEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>
	) {}

	async create(creatorId: number, createPostDto: CreatePostDto) {
		const { files, description } = createPostDto
		const creator = await this.userRepository.findOne({
			where: {
				id: creatorId
			}
		})
		const post = this.postRepository.create({ creator, files, description })
		return this.postRepository.save(post)
	}

	async addComment(userId: number, createCommentDto: CreateCommentDto) {
		const { postId, text, replyToId } = createCommentDto
		const post = await this.postRepository.findOne({
			where: {
				id: postId
			},
			relations: ['comments']
		})

		const user = await this.userRepository.findOne({
			where: {
				id: userId
			}
		})

		let replyTo = null
		if (replyToId) {
			replyTo = await this.commentRepository.findOne({
				where: {
					id: replyToId
				}
			})
		}

		const comment = this.commentRepository.create({ post, user, text, replyTo })
		return this.commentRepository.save(comment)
	}

	async likePost(postId: number, userId: number) {
		const post = await this.postRepository.findOne({
			where: {
				id: postId
			},
			relations: ['likes']
		})

		const user = await this.userRepository.findOne({
			where: {
				id: userId
			}
		})

		if (!post) {
			throw new NotFoundException(`Post not found`)
		}

		if (!user) {
			throw new NotFoundException(`User not found`)
		}

		post.likes.push(user)
		return this.postRepository.save(post)
	}

	async findAll() {
		return this.postRepository.find({
			relations: ['creator', 'comments', 'likes']
		})
	}

	async findOne(id: number) {
		return this.postRepository.findOne({
			where: {
				id
			},
			relations: ['creator', 'comments', 'likes']
		})
	}

	async findPostsByUser(userId: number) {
		return this.postRepository.find({
			where: { creator: { id: userId } },
			relations: ['creator', 'comments', 'likes']
		})
	}

	async remove(id: number) {
		return this.postRepository.delete(id)
	}
}
