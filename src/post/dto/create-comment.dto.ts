import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
	@ApiProperty({ example: 15 })
	postId: number

	@ApiProperty({ example: 15 })
	text: string

	@ApiProperty({ example: 15 })
	replyToId?: number
}
