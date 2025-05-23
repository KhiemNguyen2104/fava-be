import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: String(process.env.ACCESS_SECRET),
        })
    }

    async validate(payload: {sub: string, username: string}) {
        const user = await this.prisma.user.findUnique({
            where: {
                userEmail: payload.sub,
            },
        });

        if (!user) {
            throw new ForbiddenException("User not found")
        }

        return {
            user_id: user.userEmail,
            user_name: user.userName
        }
    }
}