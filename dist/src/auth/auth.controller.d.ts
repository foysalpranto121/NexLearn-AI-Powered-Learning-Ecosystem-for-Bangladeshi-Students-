import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            email: string;
            fullName: string;
            id: string;
            role: string;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                fullName: string;
                role: string;
            };
        };
    }>;
    refresh(req: any): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
}
