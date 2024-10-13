import { ApiProperty } from '@nestjs/swagger'

class UserDetailsDto {
	@ApiProperty({ example: 'Brief info about the user', required: false })
	readonly shortInfo?: string

	@ApiProperty({ example: 'Moscow', required: false })
	readonly city?: string

	@ApiProperty({ example: '+7 900 000 00 00', required: false })
	readonly mobilePhone?: string

	@ApiProperty({ example: '+7 800 000 00 00', required: false })
	readonly additionalPhone?: string

	@ApiProperty({ example: 'live:skypeid', required: false })
	readonly skype?: string

	@ApiProperty({ example: 'https://example.com', required: false })
	readonly site?: string

	@ApiProperty({ example: 'Activity description', required: false })
	readonly activity?: string

	@ApiProperty({ example: 'Reading, Hiking', required: false })
	readonly interests?: string

	@ApiProperty({ example: 'Rock, Jazz', required: false })
	readonly music?: string

	@ApiProperty({ example: 'Inception, The Matrix', required: false })
	readonly movies?: string

	@ApiProperty({ example: 'Friends, Breaking Bad', required: false })
	readonly TVShows?: string

	@ApiProperty({ example: 'Chess, FIFA', required: false })
	readonly games?: string

	@ApiProperty({ example: 'To be or not to be', required: false })
	readonly quotes?: string

	@ApiProperty({ type: [String], example: ['John', 'Jane'], required: false })
	readonly grandparents?: string[]

	@ApiProperty({
		type: [String],
		example: ['Michael', 'Anna'],
		required: false
	})
	readonly parents?: string[]

	@ApiProperty({ type: [String], example: ['Tom', 'Lisa'], required: false })
	readonly siblings?: string[]

	@ApiProperty({
		type: [String],
		example: ['David', 'Sophia'],
		required: false
	})
	readonly children?: string[]

	@ApiProperty({ type: [String], example: ['Alex', 'Nina'], required: false })
	readonly grandsons?: string[]
}

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com' })
	readonly email: string

	@ApiProperty({ example: 'password123' })
	readonly password: string

	@ApiProperty({ example: 'Ivanov' })
	readonly surname: string

	@ApiProperty({ example: 'Ivan' })
	readonly name: string

	@ApiProperty({ example: 'Ivanovich', required: false })
	readonly patronymic?: string

	@ApiProperty({ example: '1990-01-01', required: false })
	readonly birthdate?: string

	@ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
	readonly ava?: string

	@ApiProperty({ example: false })
	readonly isAdmin?: boolean

	@ApiProperty({ type: UserDetailsDto, required: false })
	readonly details?: UserDetailsDto // добавляем объект details
}
