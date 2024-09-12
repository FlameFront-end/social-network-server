import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { IUser } from '../types/types'

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

		const user = await this.userRepository.save({
			...createUserDto,
			password: await argon2.hash(createUserDto.password),
			isAdmin: createUserDto.email === '5017_30@mail.ru'
		})

		const token = this.jwtService.sign({ email: createUserDto.email })

		return {
			...user,
			token
		}
	}

	async findOne(email: string) {
		return await this.userRepository.findOne({
			where: { email: email }
		})
	}

	async findBuId(id: number) {
		return await this.userRepository.findOne({
			where: { id }
		})
	}

	async getAllUsers() {
		return await this.userRepository.find()
	}

	async getOtherUsers(userId: number) {
		const allUsers = await this.userRepository.find()
		return allUsers.filter(user => user.id !== userId)
	}

	async getUserByEmail(email: string) {
		return await this.findOne(email)
	}

	async updatePassword(userId: number, newPassword: string): Promise<void> {
		await this.userRepository.update({ id: userId }, { password: newPassword })
	}

	async resetPassword(user: IUser, newPassword: string): Promise<void> {
		const hashedNewPassword = await argon2.hash(newPassword)
		await this.updatePassword(user.id, hashedNewPassword)
	}

	async sendFriendRequest(userId: number, friendId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})

		const friend = await this.userRepository.findOne({
			where: { id: friendId }
		})

		if (!user || !friend) {
			throw new BadRequestException('Пользователь не найден')
		}

		if (
			user.outgoingFriendRequests &&
			user.outgoingFriendRequests.includes(friendId)
		) {
			throw new BadRequestException('Запрос на дружбу уже отправлен')
		}

		user.outgoingFriendRequests = user.outgoingFriendRequests || []
		user.outgoingFriendRequests.push(friendId)
		await this.userRepository.save(user)

		friend.incomingFriendRequests = friend.incomingFriendRequests || []
		friend.incomingFriendRequests.push(userId)
		await this.userRepository.save(friend)
	}

	async acceptFriendRequest(userId: number, friendId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})

		const friend = await this.userRepository.findOne({
			where: { id: friendId }
		})

		if (!user || !friend) {
			throw new BadRequestException('Пользователь не найден')
		}

		if (
			!user.incomingFriendRequests ||
			!user.incomingFriendRequests.includes(friendId)
		) {
			throw new BadRequestException('Запрос на дружбу не найден')
		}

		user.incomingFriendRequests = user.incomingFriendRequests.filter(
			id => id !== friendId
		)

		if (friend.outgoingFriendRequests) {
			friend.outgoingFriendRequests = friend.outgoingFriendRequests.filter(
				id => id !== userId
			)
		}

		user.friends = user.friends || []
		friend.friends = friend.friends || []

		if (!user.friends.includes(friendId)) {
			user.friends.push(friendId)
		}

		if (!friend.friends.includes(userId)) {
			friend.friends.push(userId)
		}

		await this.userRepository.save(user)
		await this.userRepository.save(friend)
	}
}
