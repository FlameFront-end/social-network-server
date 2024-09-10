import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMessagesBetweenUsers(userId1: string, userId2: string): Promise<import("./message.entity").MessageEntity[]>;
}
