import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
    resetPassword(req: any, body: ResetPasswordDto): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").UserEntity>;
    findAll(): Promise<import("./entities/user.entity").UserEntity[]>;
}
