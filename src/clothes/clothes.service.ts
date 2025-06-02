import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddClothesDto, DeleteClothesDto, GetClothesDto } from './dto/clothes.dto';
import * as argon from 'argon2';
import { Inferring } from './inferring';
import { Errors } from 'src/common';
import { Purpose } from '@prisma/client';

@Injectable()
export class ClothesService {
    constructor(private prisma: PrismaService, private inferring: Inferring) { }

    async addClothes(dto: AddClothesDto, userEmail: string) {
        const tempFloor = dto.tempFloor ? dto.tempFloor : this.inferring.tempInterring(dto.kind).tempFloor;
        const tempRoof = dto.tempRoof ? dto.tempRoof : this.inferring.tempInterring(dto.kind).tempRoof;

        const key = dto.name + "_"
            + String(dto.kind) + "_"
            + (dto.label ? dto.label : "") + "_"
            + (dto.size ? String(dto.size) : "") + "_"
            + tempFloor + "_"
            + tempRoof + "_"
            + dto.purposes.reduce((acc, ele) => acc + "_" + String(ele), "")

        console.log("Key: ", key)

        const clothes = await this.prisma.clothes.findMany({
            where: {
                name: dto.name,
                kind: dto.kind,
                tempFloor: tempFloor,
                tempRoof: tempRoof,
                ...(dto.label && { label: dto.label }),
                ...(dto.size && { size: dto.size }),
                purposes: { hasEvery: dto.purposes },
                userEmail: userEmail
            }
        })

        console.log("Clothes: ", clothes)

        for (const cl of clothes) {
            const matched = await argon.verify(cl.id, key)

            if (matched) {
                await this.prisma.clothes.update({
                    where: {
                        id_userEmail: {
                            id: cl.id,
                            userEmail: userEmail
                        }
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
                purposes: dto.purposes,
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
            purposes: newClothes.purposes,
            quant: newClothes.quant,
        }
    }

    async deleteClothes(dto: DeleteClothesDto, userEmail: string) {
        const tempFloor = dto.tempFloor ? dto.tempFloor : this.inferring.tempInterring(dto.kind).tempFloor;
        const tempRoof = dto.tempRoof ? dto.tempRoof : this.inferring.tempInterring(dto.kind).tempRoof;

        const key = dto.name + "_"
            + String(dto.kind) + "_"
            + (dto.label ? dto.label : "") + "_"
            + (dto.size ? String(dto.size) : "") + "_"
            + tempFloor + "_"
            + tempRoof + "_"
            + dto.purposes.reduce((acc, ele) => acc + "_" + String(ele), "")

        console.log("Key: ", key)

        const clothes = await this.prisma.clothes.findMany({
            where: {
                name: dto.name,
                kind: dto.kind,
                tempFloor: tempFloor,
                tempRoof: tempRoof,
                ...(dto.label && { label: dto.label }),
                ...(dto.size && { size: dto.size }),
                purposes: { hasEvery: dto.purposes },
                userEmail: userEmail
            }
        })

        console.log("Clothes: ", clothes)

        for (const cl of clothes) {
            const matched = await argon.verify(cl.id, key)

            if (matched) {
                if (cl.quant > 1) {
                    await this.prisma.clothes.update({
                        where: {
                            id_userEmail: {
                                id: cl.id,
                                userEmail: userEmail
                            }
                        },
                        data: {
                            quant: cl.quant - 1
                        }
                    })
                } else {
                    await this.prisma.clothes.delete({
                        where: {
                            id_userEmail: {
                                id: cl.id,
                                userEmail: userEmail
                            }
                        }
                    })
                }

                return cl;
            }
        }

        throw new NotFoundException(Errors.CLOTHES_NOT_FOUND);
    }

    async getClothes(dto: GetClothesDto, userEmail: string) {
        const tempFloor = dto.tempFloor ? dto.tempFloor : this.inferring.tempInterring(dto.kind).tempFloor;
        const tempRoof = dto.tempRoof ? dto.tempRoof : this.inferring.tempInterring(dto.kind).tempRoof;

        const key = dto.name + "_"
            + String(dto.kind) + "_"
            + (dto.label ? dto.label : "") + "_"
            + (dto.size ? String(dto.size) : "") + "_"
            + tempFloor + "_"
            + tempRoof + "_"
            + dto.purposes.reduce((acc, ele) => acc + "_" + String(ele), "")

        console.log("Key: ", key)

        const clothes = await this.prisma.clothes.findMany({
            where: {
                name: dto.name,
                kind: dto.kind,
                tempFloor: tempFloor,
                tempRoof: tempRoof,
                ...(dto.label && { label: dto.label }),
                ...(dto.size && { size: dto.size }),
                purposes: { hasEvery: dto.purposes },
                userEmail: userEmail
            }
        })

        if (clothes.length == 0) { throw new NotFoundException(Errors.CLOTHES_NOT_FOUND) }

        return clothes[0]
    }
}
