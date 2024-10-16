import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'

@WebSocketGateway()
@Injectable()
export class OnlineStatusGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server

	constructor(
		private readonly jwtService: JwtService,
		private userService: UserService
	) {}

	async handleConnection(client: Socket) {
		const userId = this.getUserIdFromSocket(client)

		if (userId) {
			await this.userService.updateOnlineStatus(userId, true)
			const data = await this.userService.getUserStatus(userId)

			client.emit('my-status', { userId, data })
			client.broadcast.emit('user-status', { userId, data })
		}
	}

	async handleDisconnect(client: Socket) {
		const userId = this.getUserIdFromSocket(client)

		if (userId) {
			await this.userService.updateOnlineStatus(userId, false)
			await this.userService.updateLastSeen(userId)

			const data = await this.userService.getUserStatus(userId)

			client.broadcast.emit('user-status', { userId, data })
		}
	}

	@SubscribeMessage('user-status')
	async handleGetUserStatus(
		@MessageBody('userId') targetUserId: number,
		@ConnectedSocket() client: Socket
	) {
		const data = await this.userService.getUserStatus(targetUserId)

		client.emit('user-status', { userId: targetUserId, data })
	}

	private getUserIdFromSocket(client: Socket): number | null {
		const token = client.handshake.query.token as string
		if (!token) {
			return null
		}
		try {
			const decoded = this.jwtService.verify(token)
			return decoded.id
		} catch (err) {
			console.error('JWT Verification failed:', err)
			return null
		}
	}
}
