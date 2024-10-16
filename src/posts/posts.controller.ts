import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
	Request
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserRequest } from '../types/types'

@Controller('posts')
@ApiTags('posts')
export class PostsController {
	constructor(private readonly postService: PostsService) {}

	@Post()
	@ApiBody({ type: CreatePostDto })
	@UseGuards(JwtAuthGuard)
	create(@Request() req, @Body() createPostDto: CreatePostDto) {
		return this.postService.create(+req.user.id, createPostDto)
	}

	@Post('comment')
	@ApiBody({ type: CreateCommentDto })
	@UseGuards(JwtAuthGuard)
	addComment(
		@Request() req: UserRequest,
		@Body() createCommentDto: CreateCommentDto
	) {
		return this.postService.addComment(+req.user.id, createCommentDto)
	}

	@Post(':id/like/:userId')
	@UseGuards(JwtAuthGuard)
	likePost(@Request() req: UserRequest, @Param('id') postId: string) {
		return this.postService.likePost(+postId, +req.user.id)
	}

	@Get()
	findAll() {
		return this.postService.findAll()
	}

	@Get('my')
	@UseGuards(JwtAuthGuard)
	findPostsByUser(@Request() req: UserRequest) {
		return this.postService.findPostsByUser(+req.user.id)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postService.findOne(+id)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.postService.remove(+id)
	}
}
