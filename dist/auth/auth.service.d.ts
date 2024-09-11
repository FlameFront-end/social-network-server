import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../types/types';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<import("../user/entities/user.entity").UserEntity>;
    login(user: IUser): Promise<{
        id: number;
        nick: string;
        ava: string;
        email: string;
        token: string;
    }>;
    getUserByEmail(email: string): Promise<import("../user/entities/user.entity").UserEntity>;
}
