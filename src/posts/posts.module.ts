import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { CommentsEntity } from './entities/comments.entity'
import { PostsEntity } from './entities/posts.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, CommentsEntity, PostsEntity])
	],
	controllers: [PostsController],
	providers: [PostsService]
})
export class PostsModule {}
