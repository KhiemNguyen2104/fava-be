import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AddClothesDto, DeleteClothesDto, GetClothesDto } from './dto/clothes.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtPayLoad } from 'src/common/model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { dirname, extname, join } from 'path';
import * as fs from 'fs';
import { existsSync, createReadStream } from 'fs';
import { Inferring } from './inferring';
import { Errors } from 'src/common';
import { ClothesKind, Purpose, Size } from '@prisma/client';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('clothes')
export class ClothesController {
    constructor(private clothesService: ClothesService, private inferring: Inferring) { }

    // @ApiOperation({ summary: "API for creating a new clothes's profile" })
    // @ApiBody({ type: AddClothesDto, required: true })
    // async addClothes(@Body() dto: AddClothesDto, @GetUser() user: JwtPayLoad) {
    //     return await this.clothesService.addClothes(dto, user.sub);
    // }

    @Post()
    @ApiOperation({ summary: "API for creating a new clothes's image" })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    example: "data:application/octet-stream;base64,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",
                    required: ['false']
                },
                prof: {
                    type: 'string',
                    required: ['false'],
                    example: JSON.stringify({
                        name: "T1 Jacket",
                        kind: "TShirt",
                        tempFloor: 22,
                        tempRoof: 35,
                        purposes: ['GoOut', 'Work'],
                        label: "Nike",
                        size: "XL"
                    }),
                    description: 'JSON stringified AddClothesDto'
                }
            }
        }
    })
    // @UseInterceptors(FileInterceptor('image', {
    //     storage: diskStorage({
    //         destination: (req, file, callback) => {
    //             const user = req.user as JwtPayLoad
    //             const path = join(process.cwd(), 'static', 'clothes', 'images', user.sub.split('@')[0])

    //             if (!existsSync(path)) {
    //                 fs.mkdirSync(path, { recursive: true });
    //             }

    //             callback(null, path);
    //         },
    //         filename: (req, file, callback) => {
    //             const name = `${Date.now()}-${file.originalname}`;
    //             callback(null, name);
    //         }
    //     })
    // }))
    async addClothesProf(
        // @UploadedFile() file: Express.Multer.File,
        @Body('image') image: string,
        @Body('prof') profile: string,
        @GetUser() user: JwtPayLoad
    ) {
        console.log("Profile: ", profile)
        console.log("Image: ", image)

        if (profile) {
            const prof = JSON.parse(profile)
            const imageBase64 = image

            const tempFloor = prof.tempFloor ? prof.tempFloor : this.inferring.tempInterring(prof.kind).tempFloor;
            const tempRoof = prof.tempRoof ? prof.tempRoof : this.inferring.tempInterring(prof.kind).tempRoof;

            const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new BadRequestException('Invalid base64 image format.');
            }

            const mimeType = matches[1];
            const base64Data = matches[2];
            const extension = mimeType.split('/')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const imageName = prof.name + "_"
                + prof.kind + "_"
                + (prof.label || "") + "_"
                + (prof.size || "") + "_"
                + tempFloor + "_"
                + tempRoof + "_"
                + prof.purposes.join('_')
                + `.png`;

            const savePath = join(process.cwd(), 'static', 'clothes', 'images', user.sub.split('@')[0]);

            if (!existsSync(savePath)) {
                fs.mkdirSync(savePath, { recursive: true });
            }

            const fullImagePath = join(savePath, imageName);
            console.log("Path: ", fullImagePath)
            await fs.promises.writeFile(fullImagePath, buffer);

            return await this.clothesService.addClothes(prof, user.sub);
        } else {
            // TODO
        }
    }

    @Delete()
    @ApiOperation({ summary: 'API for deleting a clothes' })
    @ApiBody({ type: DeleteClothesDto, required: true })
    async deleteClothes(@Body() dto: DeleteClothesDto, @GetUser() user: JwtPayLoad) {
        const clothes = await this.clothesService.deleteClothes(dto, user.sub)

        if (clothes) {
            if (clothes.quant == 1) {
                const fileName = clothes.name + "_"
                    + clothes.kind + "_"
                    + (clothes.label || "") + "_"
                    + (clothes.size || "") + "_"
                    + clothes.tempFloor + "_"
                    + clothes.tempRoof + "_"
                    + clothes.purposes.join('_') + ".png"

                const pathToFile = join(process.cwd(), 'static', 'clothes', 'images', user.sub.split('@')[0], fileName);

                try {
                    await fs.promises.unlink(pathToFile);
                    console.log(`Deleted image file: ${pathToFile}`);
                } catch (error) {
                    console.warn(`Image file not found or failed to delete: ${pathToFile}`);
                }
            }

            return { message: 'Clothes and associated image deleted successfully' };
        } else {
            throw new ForbiddenException(Errors.DELETE_CLOTHES_ERROR)
        }
    }

    @Get('profile')
    @ApiOperation({ summary: "The API for getting the clothing's profile" })
    @ApiQuery({ type: String, name: 'name', required: true, default: 'T1 Jacket' })
    @ApiQuery({ name: 'kind', required: true, default: ClothesKind.TShirt })
    @ApiQuery({ type: Number, name: 'tempFloor', required: true, default: 22 })
    @ApiQuery({ type: Number, name: 'tempRoof', required: true, default: 35 })
    @ApiQuery({ type: String, name: 'purposes', required: true, default: [Purpose.GoOut, Purpose.Work] })
    @ApiQuery({ type: String, name: 'label', required: false, default: 'Nike' })
    @ApiQuery({ name: 'size', required: false, default: Size.XL })
    async getClothesProfile(
        @GetUser() user: JwtPayLoad,
        @Query('name') name: string,
        @Query('kind') kind: ClothesKind,
        @Query('tempFloor') tempFloor: number,
        @Query('tempRoof') tempRoof: number,
        @Query('purposes') purposes: string,
        @Query('label') label?: string,
        @Query('size') size?: Size,
    ) {
        const ps = JSON.parse(purposes)
        console.log("Purposes: ", ps)

        const dto = {
            name: name,
            kind: kind,
            tempFloor: Number(tempFloor),
            tempRoof: Number(tempRoof),
            purposes: ps,
            ...(label && { label: label }),
            ...(size && { size: size })
        } as GetClothesDto

        return await this.clothesService.getClothes(dto, user.sub);
    }

    @Get('image')
    @ApiOperation({ summary: "The API for getting the clothing's image" })
    @ApiQuery({ type: String, name: 'name', required: true, default: 'T1 Jacket' })
    @ApiQuery({ name: 'kind', required: true, default: ClothesKind.TShirt })
    @ApiQuery({ type: Number, name: 'tempFloor', required: true, default: 22 })
    @ApiQuery({ type: Number, name: 'tempRoof', required: true, default: 35 })
    @ApiQuery({ type: String, name: 'purposes', required: true, default: [Purpose.GoOut, Purpose.Work] })
    @ApiQuery({ type: String, name: 'label', required: false, default: 'Nike' })
    @ApiQuery({ name: 'size', required: false, default: Size.XL })
    async getClothesImage(
        @Res() res: Response,
        @GetUser() user: JwtPayLoad,
        @Query('name') name: string,
        @Query('kind') kind: ClothesKind,
        @Query('tempFloor') tempFloor: number,
        @Query('tempRoof') tempRoof: number,
        @Query('purposes') purposes: string,
        @Query('label') label?: string,
        @Query('size') size?: Size,
    ) {
        const ps = JSON.parse(purposes)

        const dto = {
            name: name,
            kind: kind,
            tempFloor: Number(tempFloor),
            tempRoof: Number(tempRoof),
            purposes: ps,
            ...(label && { label: label }),
            ...(size && { size: size })
        } as GetClothesDto

        const fileName = dto.name + "_"
            + dto.kind + "_"
            + (dto.label || "") + "_"
            + (dto.size || "") + "_"
            + dto.tempFloor + "_"
            + dto.tempRoof + "_"
            + dto.purposes.join('_') + ".png"

        console.log("File: ", fileName)

        const imagePath = join(process.cwd(), 'static', 'clothes', 'images', user.sub.split('@')[0], fileName);

        if (!existsSync(imagePath)) { throw new NotFoundException(Errors.CLOTHES_IMAGE_NOT_FOUND) }

        const stream = createReadStream(imagePath);
        res.set({ 'Content-Type': 'image/png' });

        return stream.pipe(res)
    }
}
