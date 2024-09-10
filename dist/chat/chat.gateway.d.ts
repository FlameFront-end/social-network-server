import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleMessage(message: {
        senderId: number;
        receiverId: number;
        content: string;
    }, client: Socket): Promise<void>;
}
