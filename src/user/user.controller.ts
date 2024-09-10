import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Request,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { avaStorage } from '../storage'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import * as argon2 from 'argon2'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@UseInterceptors(
		FileInterceptor('ava', {
			storage: avaStorage
		})
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				ava: {
					type: 'string',
					format: 'binary'
				},
				nick: {
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
	@UsePipes(new ValidationPipe())
	create(
		@UploadedFile()
		ava: Express.Multer.File,
		@Body() createUserDto: CreateUserDto
	) {
		return this.userService.create({
			...createUserDto,
			ava: `http://localhost:3000/uploads/ava/${ava.filename}`
		})
	}

	@Patch('reset-password')
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

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findBuId(+id)
	}

	@Get()
	findAll() {
		return this.userService.findAll()
	}
}
