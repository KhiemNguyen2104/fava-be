import { Body, Controller, Get, NotFoundException, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtPayLoad } from 'src/common/model';
import { UpdateDto } from './dto';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as argon from 'argon2';
import { Errors } from 'src/common';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile')
    @ApiOperation({ summary: 'API for getting the current user profile' })
    async getCurrentUserProfile(@GetUser() data: JwtPayLoad) {
        return await this.userService.getUser(data.sub);
    }

    @Get('avatar')
    @ApiOperation({ summary: "API for getting the current user's avatar" })
    async getCurrentUserAvatar(@GetUser() data: JwtPayLoad, @Res() res) {
        const fileName = data.sub.split('@')[0]
        const avatarPath = join(process.cwd(), 'static', 'avatars', `${fileName}.png`);

        if (!existsSync(avatarPath)) { throw new NotFoundException(Errors.AVATAR_NOT_FOUND) }

        const stream = createReadStream(avatarPath);
        res.set({ 'Content-Type': 'image/png' });

        return stream.pipe(res);
    }

    @Get('background')
    @ApiOperation({ summary: "API for getting the current user's background" })
    async getCurrentUserBackground(@GetUser() data: JwtPayLoad, @Res() res) {
        const fileName = data.sub.split('@')[0]
        const backgroundPath = join(process.cwd(), 'static', 'backgrounds', `${fileName}.png`);

        if (!existsSync(backgroundPath)) { throw new NotFoundException(Errors.BACKGROUND_NOT_FOUND) }

        const stream = createReadStream(backgroundPath);
        res.set({ 'Content-Type': 'image/png' });

        return stream.pipe(res);
    }

    @Put('profile')
    @ApiOperation({ summary: "API for updating the user's profile" })
    @ApiBody({ type: UpdateDto, required: true })
    async updateCurrentUserProfile(@Body() dto: UpdateDto) {
        return await this.userService.updateUser(dto)
    }

    @ApiOperation({ summary: "API for updating the user's avatar" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Post('avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: join(process.cwd(), 'static', 'avatars'),
            filename: async (req, file, cb) => {
                const user = req.user as JwtPayLoad;

                const fileName = user.sub.split('@')[0]

                const filename = `${fileName}.png`;
                cb(null, filename);
            },
        }),
    }))
    async uploadAvatar(
        @UploadedFile() avatar: Express.Multer.File,
        @GetUser() user: JwtPayLoad,
    ) {
        return {
            message: 'Upload successful',
            filename: `${user.sub.split('@')[0]}.png`,
        };
    }

    @ApiOperation({ summary: "API for updating the user's background" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                background: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Post('background')
    @UseInterceptors(FileInterceptor('background', {
        storage: diskStorage({
            destination: join(process.cwd(), 'static', 'backgrounds'),
            filename: async (req, file, cb) => {
                const user = req.user as JwtPayLoad;

                const fileName = user.sub.split('@')[0]

                const filename = `${fileName}.png`;
                cb(null, filename);
            },
        }),
    }))
    async uploadBackground(
        @UploadedFile() background: Express.Multer.File,
        @GetUser() user: JwtPayLoad,
    ) {
        return {
            message: 'Upload successful',
            filename: `${user.sub.split('@')[0]}.png`,
        };
    }
}
