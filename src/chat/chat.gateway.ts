import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() message: { senderId: number; receiverId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const savedMessage = await this.chatService.saveMessage(message);
    this.server.emit('receiveMessage', savedMessage);
  }
}
