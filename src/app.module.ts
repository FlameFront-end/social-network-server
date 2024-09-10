import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { Message } from './chat/message.entity';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ChatModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'drona.db.elephantsql.com',
      port: 5432,
      username: 'jmzlkhzz',
      password: 'OymD5jvBOeIX9c9Swz2tTXNl01U1lcD_',
      database: 'jmzlkhzz',
      entities: [Message],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
