import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { IUser } from '../types/types'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findOne(email)
		console.log('validateUser user', user)
		const passwordIsMatch = await argon2.verify(user.password, password)

		if (user && passwordIsMatch) {
			return user
		}

		throw new UnauthorizedException('Неверная почта или пароль!')
	}

	async login(user: IUser) {
		const { id, email, surname, patronymic, name, ava } = user

		return {
			id,
			ava,
			surname,
			patronymic,
			name,
			email,
			token: this.jwtService.sign({ id: user.id, email: user.email })
		}
	}

	async getUserByEmail(email: string) {
		return await this.userService.findOne(email)
	}
}
