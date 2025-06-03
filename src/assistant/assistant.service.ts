import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuggestionDto } from './dto';

@Injectable()
export class AssistantService {
    constructor(private prisma: PrismaService) { }

    async getSuggestion(dto: SuggestionDto, userEmail: string) {
        const allClothes = await this.prisma.clothes.findMany({
            where: {
                userEmail: userEmail
            }
        })

        let clothes = allClothes

        clothes = dto.kind ? clothes.filter((item) => { return String(item.kind) == String(dto.kind) }) : clothes;
        clothes = dto.label ? clothes.filter((item) => { return String(item.label) == String(dto.label) }) : clothes;
        clothes = dto.size ? clothes.filter((item) => { return String(item.size) == String(dto.size) }) : clothes;

        if (dto.tempFloor !== undefined) {
            clothes = clothes.filter(item => item.tempRoof >= dto.tempFloor!);
        }

        if (dto.tempRoof !== undefined) {
            clothes = clothes.filter(item => item.tempFloor <= dto.tempRoof!);
        }

        clothes = clothes.filter((item) => { return item.purposes.some((p) => dto.purposes.includes(p)) })

        clothes.sort((a, b) => {
            const aMatches = a.purposes.filter(p => dto.purposes.includes(p)).length;
            const bMatches = b.purposes.filter(p => dto.purposes.includes(p)).length;
            return bMatches - aMatches; // descending: more matches first
        });

        return clothes
    }
}
