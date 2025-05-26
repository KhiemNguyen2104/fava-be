import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login API to take a new Access Token and a new Refresh Token.' })
    @ApiBody({ type: LoginDto, required: true })
    async login(@Body() payload: LoginDto) {
        return await this.authService.login(payload);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Signup API to take a new account attached with a new Access Token and a new Refresh Token.' })
    @ApiBody({ type: SignupDto, required: true })
    async signup(@Body() payload: SignupDto) {
        return await this.authService.signup(payload);
    }

    @Post('resignAccessToken')
    @ApiOperation({ summary: 'Resign API to take a new Access Token based on the user\'s Refresh Token' })
    @ApiQuery({ name: 'Refresh Token', description: "The user's Refreah Token", type: String, required: true })
    async resignAccessToken(@Query('Refresh Token') refreshToken: string) {
        return await this.authService.resignAccessToken(refreshToken);
    }

    @Post('takeRefreshToken')
    @ApiOperation({ summary: 'The API to take the user\'s Refresh Token (just for dev)' })
    @ApiQuery({ name: 'userEmail', description: "The user's email", type: String, required: true, default: 'nphucanhduong@gmail.com' })
    async refreshToken(@Query('userEmail') userEmail: string) {
        return await this.authService.signRefreshToken(userEmail);
    }
}
