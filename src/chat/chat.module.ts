import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatController } from './chat.controller'
import { MessageEntity } from './entities/message.entity'
import { ChatEntity } from './entities/chat.entity'

@Module({
	controllers: [ChatController],
	providers: [ChatService],
	imports: [TypeOrmModule.forFeature([MessageEntity, ChatEntity])]
})
export class ChatModule {}
