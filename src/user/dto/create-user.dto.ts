import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
	@ApiProperty()
	readonly email: string

	@ApiProperty()
	readonly password: string

	@ApiProperty()
	readonly surname: string

	@ApiProperty()
	readonly name: string

	@ApiProperty()
	readonly patronymic: string

	@ApiProperty()
	readonly birthdate: string

	@ApiProperty()
	readonly ava: string
}
