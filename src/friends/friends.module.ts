import { Module } from '@nestjs/common'
import { FriendsService } from './friends.service'
import { FriendsController } from './friends.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [FriendsController],
	providers: [FriendsService]
})
export class FriendsModule {}
