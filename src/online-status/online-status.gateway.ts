import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
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
		if (!userId) {
			client.disconnect()
			return
		}
		await this.userService.updateOnlineStatus(userId, true)
		this.server.emit('user-status', { userId, online: true })
	}

	async handleDisconnect(client: Socket) {
		const userId = this.getUserIdFromSocket(client)
		if (userId) {
			await this.userService.updateOnlineStatus(userId, false)
			await this.userService.updateLastSeen(userId)
			this.server.emit('user-status', { userId, online: false })
		}
	}

	private getUserIdFromSocket(client: Socket): number | null {
		const token = client.handshake.query.token as string
		if (!token) {
			return null
		}
		const decoded = this.jwtService.verify(token)
		return decoded.id
	}
}
