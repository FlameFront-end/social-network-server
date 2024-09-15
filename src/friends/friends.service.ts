import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class FriendsService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async getPossibleFriends(userId: number) {
		const allUsers = await this.userRepository.find()
		return allUsers.filter(
			user =>
				user.id !== userId &&
				!user.friends.includes(userId) &&
				!user.incomingFriendRequests.includes(userId) &&
				!user.outgoingFriendRequests.includes(userId)
		)
	}

	async getIncomingFriendshipRequests(userId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})

		const friendIds = user.incomingFriendRequests

		return await this.userRepository.findByIds(friendIds)
	}

	async getOutgoingFriendshipRequests(userId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})

		const friendIds = user.outgoingFriendRequests

		return await this.userRepository.findByIds(friendIds)
	}

	async getMyFriends(userId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})

		const friendIds = user.friends

		return await this.userRepository.findByIds(friendIds)
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

	async removeFriendRequest(userId: number, friendId: number) {
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
			!user.outgoingFriendRequests ||
			!user.outgoingFriendRequests.includes(friendId)
		) {
			throw new BadRequestException('Запрос на дружбу не найден')
		}

		user.outgoingFriendRequests = user.outgoingFriendRequests.filter(
			id => id !== friendId
		)
		await this.userRepository.save(user)

		if (friend.incomingFriendRequests) {
			friend.incomingFriendRequests = friend.incomingFriendRequests.filter(
				id => id !== userId
			)
			await this.userRepository.save(friend)
		}
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

	async declineFriendRequest(userId: number, friendId: number) {
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

		await this.userRepository.save(user)
		await this.userRepository.save(friend)
	}

	async removeFriend(userId: number, friendId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})

		const friend = await this.userRepository.findOne({
			where: { id: friendId }
		})

		if (!user || !friend) {
			throw new BadRequestException('Пользователь не найден')
		}

		if (!user.friends.includes(friendId)) {
			throw new BadRequestException('Пользователь не является вашим другом')
		}

		user.friends = user.friends.filter(id => id !== friendId)

		friend.friends = friend.friends.filter(id => id !== userId)

		await this.userRepository.save(user)
		await this.userRepository.save(friend)
	}
}
