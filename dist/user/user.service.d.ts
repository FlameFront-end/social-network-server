import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../types/types';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<UserEntity>, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<{
        token: string;
        email: string;
        password: string;
        nick: string;
        ava: string;
        isAdmin: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(email: string): Promise<UserEntity>;
    findBuId(id: number): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    getUserByEmail(email: string): Promise<UserEntity>;
    updatePassword(userId: number, newPassword: string): Promise<void>;
    resetPassword(user: IUser, newPassword: string): Promise<void>;
}
