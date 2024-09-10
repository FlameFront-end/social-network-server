import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(messageData: { senderId: number; receiverId: number; content: string }) {
    const message = this.messageRepository.create(messageData);
    return await this.messageRepository.save(message);
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number) {
    return this.messageRepository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: { createdAt: 'ASC' },
    });
  }
}
