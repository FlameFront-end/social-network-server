import { Module } from '@nestjs/common'
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatController } from './chat.controller';


@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [
    TypeOrmModule.forFeature([
      Message
    ])
  ],
})
export class ChatModule {}
