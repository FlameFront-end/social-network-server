import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { CommentEntity } from './entities/comment.entity'
import { PostEntity } from './entities/post.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, CommentEntity, PostEntity])],
	controllers: [PostController],
	providers: [PostService]
})
export class PostModule {}
