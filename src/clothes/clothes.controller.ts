import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
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
                        purposes: ['Work', 'GoOut'],
                        label: "Nike",
                        size: "XL"
                    }),
                    description: 'JSON stringified AddClothesDto'
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const user = req.user as JwtPayLoad
                const path = join(process.cwd(), 'static', 'clothes', 'images', user.sub.split('@')[0])

                if (!existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }

                callback(null, path);
            },
            filename: (req, file, callback) => {
                const name = `${Date.now()}-${file.originalname}`;
                callback(null, name);
            }
        })
    }))
    async addClothesProf(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @GetUser() user: JwtPayLoad
    ) {
        console.log("Profile: ", req.body.prof)

        if (req.body.prof) {
            const prof = JSON.parse(req.body?.prof)

            const tempFloor = prof.tempFloor ? prof.tempFloor : this.inferring.tempInterring(prof.kind).tempFloor;
            const tempRoof = prof.tempRoof ? prof.tempRoof : this.inferring.tempInterring(prof.kind).tempRoof;

            if (file.path) {
                const oldPath = file.path
                const newFileName = prof.name + "_"
                    + prof.kind + "_"
                    + (prof.label || "") + "_"
                    + (prof.size || "") + "_"
                    + tempFloor + "_"
                    + tempRoof + "_"
                    + prof.purposes.join('_')
                    + extname(file.originalname);
                const newPath = join(dirname(file.path), newFileName);

                await fs.promises.rename(oldPath, newPath)
            }

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
    @ApiQuery({ type: String, name: 'purposes', required: true, default: [Purpose.Work, Purpose.GoOut] })
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
    @ApiQuery({ type: String, name: 'purposes', required: true, default: [Purpose.Work, Purpose.GoOut] })
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

        const stream = createReadStream(imagePath)
        res.set({ 'Content-Type': 'image/png' });

        return stream.pipe(res)
    }
}
