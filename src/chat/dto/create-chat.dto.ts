import { ApiProperty } from '@nestjs/swagger'

export class CreateChatDto {
	@ApiProperty()
	readonly senderId: number

	@ApiProperty()
	readonly receiverId: number
}
