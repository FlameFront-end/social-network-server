import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Request,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import * as argon2 from 'argon2'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				ava: {
					type: 'string'
				},
				surname: {
					type: 'string'
				},
				name: {
					type: 'string'
				},
				patronymic: {
					type: 'string'
				},
				email: {
					type: 'string'
				},
				birthdate: {
					type: 'string',
					default: '24.09.2004'
				},
				password: {
					type: 'string'
				}
			}
		}
	})
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Patch('/update')
	@UseGuards(JwtAuthGuard)
	async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(req.user.id, updateUserDto)
	}

	@Patch('/reset-password')
	@UseGuards(JwtAuthGuard)
	async resetPassword(@Request() req, @Body() body: ResetPasswordDto) {
		const { old_password, new_password } = body
		const user = await this.userService.getUserByEmail(req.user.email)

		const isOldPasswordValid = await argon2.verify(user.password, old_password)

		if (isOldPasswordValid) {
			await this.userService.resetPassword(user, new_password)
			return { message: 'Password reset successful' }
		} else {
			throw new UnauthorizedException('Old password is incorrect')
		}
	}

	@Get('/all')
	async getAllUsers() {
		return await this.userService.getAllUsers()
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.userService.findBuId(+id)
	}
}
