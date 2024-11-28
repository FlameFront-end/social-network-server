import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { IUser } from '../types/types'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDetailsEntity } from './entities/user-details.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly jwtService: JwtService
	) {}

	async create(createUserDto: CreateUserDto) {
		const existUser = await this.userRepository.findOne({
			where: {
				email: createUserDto.email
			}
		})

		if (existUser) {
			throw new BadRequestException('Эта почта уже занята')
		}

		const userDetails = new UserDetailsEntity()
		if (createUserDto.details) {
			Object.assign(userDetails, createUserDto.details)
		}

		const user = await this.userRepository.save({
			...createUserDto,
			password: await argon2.hash(createUserDto.password),
			isAdmin: createUserDto.email === '5017_30@mail.ru',
			details: userDetails
		})

		const token = this.jwtService.sign({ email: createUserDto.email })

		return {
			...user,
			token
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['details']
		})

		if (!user) {
			throw new Error('User not found')
		}

		const { details, ...userUpdateData } = updateUserDto

		Object.assign(user, userUpdateData)

		if (details) {
			Object.assign(user.details, details)
			await this.userRepository.manager.save(user.details)
		}

		await this.userRepository.save(user)
		return user
	}

	async findOneByEmail(email: string, details?: boolean) {
		if (details) {
			return await this.userRepository.findOne({
				where: { email: email },
				relations: ['details']
			})
		} else {
			return await this.userRepository.findOne({
				where: { email: email }
			})
		}
	}

	async findOneById(id: number, details?: boolean) {
		if (!id) return null

		if (details) {
			return await this.userRepository.findOne({
				where: { id },
				relations: ['details']
			})
		} else {
			return await this.userRepository.findOne({
				where: { id }
			})
		}
	}

	async getAllUsers(details?: boolean) {
		const options = details ? { relations: ['details'] } : {}
		return await this.userRepository.find(options)
	}

	async updatePassword(userId: number, newPassword: string): Promise<void> {
		await this.userRepository.update({ id: userId }, { password: newPassword })
	}

	async resetPassword(user: IUser, newPassword: string): Promise<void> {
		const hashedNewPassword = await argon2.hash(newPassword)
		await this.updatePassword(user.id, hashedNewPassword)
	}

	async updateOnlineStatus(userId: number, isOnline: boolean): Promise<void> {
		await this.userRepository.update(userId, { isOnline })
	}

	async updateLastSeen(userId: number): Promise<void> {
		await this.userRepository.update(userId, { lastSeen: new Date() })
	}

	async getUserStatus(
		userId: number
	): Promise<{ isOnline: boolean; lastSeen: any }> {
		const user = await this.userRepository.findOne({ where: { id: userId } })
		return { isOnline: true, lastSeen: '' }
	}
}
