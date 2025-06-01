import { Injectable, NotFoundException } from '@nestjs/common';
import { Errors } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUser(userEmail?: string) {
        if (userEmail) {
            const user = await this.prisma.user.findUnique({
                where: {
                    userEmail: userEmail
                }
            })

            if (!user) { throw new NotFoundException(Errors.USER_NOT_FOUND) }

            return {
                userName: user.userName,
                userEmail: user.userEmail,
                currentLocation: user.currentLocation,
                suggestions: user.suggestions,
                usefulSuggestions: user.usefulSuggestions
            }
        } else {
            return (await this.prisma.user.findMany()).map((user) => {
                return {
                    userName: user.userName,
                    userEmail: user.userEmail,
                    currentLocation: user.currentLocation,
                    suggestions: user.suggestions,
                    usefulSuggestions: user.usefulSuggestions
                };
            })
        }
    }

    async updateUser(dto: UpdateDto): Promise<UpdateDto> {
        const user = await this.prisma.user.findUnique({
            where: {
                userEmail: dto.userEmail
            }
        })

        if (!user) { throw new NotFoundException(Errors.USER_NOT_FOUND) }

        await this.prisma.user.update({
            where: {
                userEmail: dto.userEmail
            },
            data: {
                ...(dto.userName && { userName: dto.userName }),
                ...(dto.currentLocation && { currentLocation: dto.currentLocation }),
            }
        })

        return dto
    }
}
