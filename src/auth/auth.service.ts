import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { Errors } from 'src/common';
import * as argon from 'argon2';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private amadeusService: AmadeusService, private weatherService: WeatherService) { }

    async login(dto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.prisma.user.findUnique({
            where: {
                userEmail: dto.userEmail
            }
        })

        if (!user) { throw new NotFoundException(Errors.USER_NOT_FOUND); }

        const matched = await argon.verify(user.hashKey, dto.password);

        if (!matched) { throw new ForbiddenException(Errors.LOGIN_ERROR) }

        const accessToken = await this.signAccessToken(user.userEmail, user.userName);
        const refreshToken = await this.signRefreshToken(user.userEmail);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async signup(dto: SignupDto): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.prisma.user.findUnique({
            where: {
                userEmail: dto.userEmail
            }
        })

        if (user) { throw new ForbiddenException(Errors.EMAIL_ALREADY_EXIST) }

        const hash = await argon.hash(dto.password)

        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        const cityName = await this.amadeusService.searchCity(data.city)

        console.log("Default City: ", cityName);

        const newUser = await this.prisma.user.create({
            data: {
                userEmail: dto.userEmail,
                hashKey: hash,
                userName: dto.userName,
                currentLocation: cityName,
            }
        })

        const city = await this.prisma.weatherLocations.findUnique({
            where: {
                cityName: cityName
            }
        })

        if (!city) {
            await this.prisma.weatherLocations.create({
                data: {
                    cityName: cityName
                }
            })
        }

        const addCity = await this.weatherService.addLocation(cityName, dto.userEmail);

        const accessToken = await this.signAccessToken(dto.userEmail, dto.userName);
        const refreshToken = await this.signRefreshToken(dto.userEmail);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async signAccessToken(userEmail: string, userName: string): Promise<string> {
        const payload = {
            sub: userEmail,
            userName
        }

        const secret = process.env.ACCESS_SECRET

        try {
            const accessToken = await this.jwt.signAsync(payload, { expiresIn: '15m', secret: secret });

            return accessToken
        } catch (err) {
            throw new ForbiddenException(Errors.ACCESS_TOKEN_SIGNING_ERROR + " " + err)
        }
    }

    async signRefreshToken(userEmail: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: {
                userEmail: userEmail
            }
        })

        if (!user) { throw new NotFoundException(Errors.USER_NOT_FOUND) }

        const userName = user.userName;

        const payload = {
            sub: userEmail,
            userName
        }

        const secret = process.env.REFRESH_SECRET

        try {
            const refreshToken = await this.jwt.signAsync(payload, { expiresIn: '7d', secret: secret });

            await this.prisma.user.update({
                where: {
                    userEmail: userEmail
                },
                data: {
                    refreshToken: refreshToken
                }
            })

            return refreshToken
        } catch (err) {
            throw new ForbiddenException(Errors.REFRESH_TOKEN_SIGNING_ERROR + " " + err)
        }
    }

    async resignAccessToken(refreshToken: string): Promise<string> {
        const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.REFRESH_SECRET });

        return this.signAccessToken(payload.sub, payload.userName);
    }
}
