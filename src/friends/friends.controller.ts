import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Request,
	UseGuards
} from '@nestjs/common'
import { FriendsService } from './friends.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get('/my-friends')
	@UseGuards(JwtAuthGuard)
	async getMyFriends(@Request() req) {
		return await this.friendsService.getFriendsById(req.user.id)
	}

	@Get('/possible-friends')
	@UseGuards(JwtAuthGuard)
	async getPossibleFriends(@Request() req) {
		return await this.friendsService.getPossibleFriends(req.user.id)
	}

	@Get('/incoming-friendship-requests')
	@UseGuards(JwtAuthGuard)
	async getIncomingFriendshipRequests(@Request() req) {
		return await this.friendsService.getIncomingFriendshipRequests(req.user.id)
	}

	@Get('/outgoing-friendship-requests')
	@UseGuards(JwtAuthGuard)
	async getOutgoingFriendshipRequests(@Request() req) {
		return await this.friendsService.getOutgoingFriendshipRequests(req.user.id)
	}

	@Patch('/send-friend-request/:friendId')
	@UseGuards(JwtAuthGuard)
	async sendFriendRequest(@Request() req, @Param('friendId') friendId: string) {
		await this.friendsService.sendFriendRequest(req.user.id, +friendId)
		return { message: 'Friend request sent' }
	}

	@Delete('/remove-friend-request/:friendId')
	@UseGuards(JwtAuthGuard)
	async removeFriendRequest(
		@Request() req,
		@Param('friendId') friendId: string
	) {
		await this.friendsService.removeFriendRequest(req.user.id, +friendId)
		return { message: 'Friend request remove' }
	}

	@Patch('/accept-friend-request/:friendId')
	@UseGuards(JwtAuthGuard)
	async acceptFriendRequest(
		@Request() req,
		@Param('friendId') friendId: string
	) {
		await this.friendsService.acceptFriendRequest(req.user.id, +friendId)
		return { message: 'Friend request accepted' }
	}

	@Delete('/decline-friend-request/:friendId')
	@UseGuards(JwtAuthGuard)
	async declineFriendRequest(
		@Request() req,
		@Param('friendId') friendId: string
	) {
		await this.friendsService.declineFriendRequest(req.user.id, +friendId)
		return { message: 'Friend request decline' }
	}

	@Delete('/remove-friend/:friendId')
	@UseGuards(JwtAuthGuard)
	async removeFriend(@Request() req, @Param('friendId') friendId: string) {
		await this.friendsService.removeFriend(req.user.id, +friendId)
		return { message: 'Friend removed' }
	}

	@Get(':userId')
	async getFriendsById(@Param('userId') userId: string) {
		return await this.friendsService.getFriendsById(+userId)
	}
}
