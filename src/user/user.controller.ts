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
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import * as argon2 from 'argon2'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiConsumes('multipart/form-data')
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
				password: {
					type: 'string'
				}
			}
		}
	})
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
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

	@Patch('/send-friend-request/:friendId')
	@UseGuards(JwtAuthGuard)
	async sendFriendRequest(@Request() req, @Param('friendId') friendId: string) {
		await this.userService.sendFriendRequest(req.user.id, +friendId)
		return { message: 'Friend request sent' }
	}

	@Patch('/accept-friend-request/:friendId')
	@UseGuards(JwtAuthGuard)
	async acceptFriendRequest(
		@Request() req,
		@Param('friendId') friendId: string
	) {
		await this.userService.acceptFriendRequest(req.user.id, +friendId)
		return { message: 'Friend request accepted' }
	}

	@Get('/possible-friends')
	@UseGuards(JwtAuthGuard)
	async getPossibleFriends(@Request() req) {
		return await this.userService.getPossibleFriends(req.user.id)
	}

	@Get('/all')
	async getAllUsers() {
		return await this.userService.getAllUsers()
	}

	@Get('/my-friends')
	@UseGuards(JwtAuthGuard)
	async getMyFriends(@Request() req) {
		return await this.userService.getMyFriends(req.user.id)
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.userService.findBuId(+id)
	}
}
