import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddClothesDto, DeleteClothesDto } from './dto/clothes.dto';
import * as argon from 'argon2';
import { Inferring } from './inferring';

@Injectable()
export class ClothesService {
    constructor(private prisma: PrismaService, private inferring: Inferring) { }

    async addClothes(dto: AddClothesDto, userEmail: string) {
        const tempFloor = dto.tempFloor ? dto.tempFloor : this.inferring.tempInterring(dto.kind).tempFloor;
        const tempRoof = dto.tempRoof ? dto.tempRoof : this.inferring.tempInterring(dto.kind).tempRoof;

        const key = dto.name
            + "_"
            + String(dto.kind)
            + "_"
            + (dto.label ? dto.label : "")
            + "_"
            + (dto.size ? String(dto.size) : "")
            + "_"
            + tempFloor
            + "_"
            + tempRoof

        console.log("Key: ", key)

        const clothes = await this.prisma.clothes.findMany({
            where: {
                name: dto.name,
                kind: dto.kind,
                tempFloor: tempFloor,
                tempRoof: tempRoof,
                ...(dto.label && { label: dto.label }),
                ...(dto.size && { size: dto.size }),
                userEmail: userEmail
            }
        })

        console.log("Clothes: ", clothes)

        for (const cl of clothes) {
            const matched = await argon.verify(cl.id, key)

            if (matched) {
                await this.prisma.clothes.update({
                    where: {
                        id: cl.id
                    },
                    data: {
                        quant: cl.quant + 1
                    }
                })

                return dto
            }
        }

        const clothesId = await argon.hash(key)

        const newClothes = await this.prisma.clothes.create({
            data: {
                id: clothesId,
                name: dto.name,
                kind: dto.kind,
                tempFloor: tempFloor,
                tempRoof: tempRoof,
                ...(dto.label && { label: dto.label }),
                ...(dto.size && { size: dto.size }),
                quant: 1,
                userEmail: userEmail
            }
        })

        return {
            name: newClothes.name,
            kind: newClothes.kind,
            tempFloor: newClothes.tempFloor,
            tempRoof: newClothes.tempRoof,
            ...(newClothes.label && { label: newClothes.label }),
            ...(newClothes.size && { size: newClothes.size }),
            quant: newClothes.quant,
        }
    }

    async deleteClothes(dto: DeleteClothesDto, userEmail: string) {
        const tempFloor = dto.tempFloor ? dto.tempFloor : this.inferring.tempInterring(dto.kind).tempFloor;
        const tempRoof = dto.tempRoof ? dto.tempRoof : this.inferring.tempInterring(dto.kind).tempRoof;

        const key = dto.name
            + "_"
            + String(dto.kind)
            + "_"
            + (dto.label ? dto.label : "")
            + "_"
            + (dto.size ? String(dto.size) : "")
            + "_"
            + tempFloor
            + "_"
            + tempRoof

        console.log("Key: ", key)

        const clothes = await this.prisma.clothes.findMany({
            where: {
                name: dto.name,
                kind: dto.kind,
                tempFloor: tempFloor,
                tempRoof: tempRoof,
                ...(dto.label && { label: dto.label }),
                ...(dto.size && { size: dto.size }),
                userEmail: userEmail
            }
        })

        console.log("Clothes: ", clothes)

        for (const cl of clothes) {
            const matched = await argon.verify(cl.id, key)

            if (matched) {
                await this.prisma.clothes.delete({
                    where: {
                        id: cl.id
                    }
                })

                return cl;
            }
        }

        return null;
    }
}
