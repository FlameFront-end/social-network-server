import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
	@ApiProperty({
		example: [
			'https://upcdn.io/W142ipT/raw/uploads/2024/10/13/4kGcKW858b-eec59b72-6acf-4ebd-9bed-751da7fc4700_ava.png'
		]
	})
	files: string[]

	@ApiProperty({ example: 'Описание' })
	description: string
}
