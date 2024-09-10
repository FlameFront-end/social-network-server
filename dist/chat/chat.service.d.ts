import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
export declare class ChatService {
    private messageRepository;
    constructor(messageRepository: Repository<MessageEntity>);
    saveMessage(messageData: {
        senderId: number;
        receiverId: number;
        content: string;
    }): Promise<MessageEntity>;
    getMessagesBetweenUsers(userId1: number, userId2: number): Promise<MessageEntity[]>;
}
