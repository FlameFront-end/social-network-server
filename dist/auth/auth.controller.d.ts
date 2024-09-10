import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        id: number;
        email: string;
        token: string;
    }>;
    getProfile(req: any): Promise<import("../user/entities/user.entity").UserEntity>;
}
