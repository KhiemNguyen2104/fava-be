import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtPayLoad } from 'src/common/model';
import { ClothesKind, Purpose, Size } from '@prisma/client';
import { SuggestionDto } from './dto';

@ApiBearerAuth()
@ApiTags('Assistant')
@UseGuards(AuthGuard('jwt'))
@Controller('assistant')
export class AssistantController {
    constructor(private assistantService: AssistantService) { }

    @Get()
    @ApiQuery({ name: 'kind', required: false, default: ClothesKind.TShirt })
    @ApiQuery({ type: Number, name: 'tempFloor', required: false, default: 22 })
    @ApiQuery({ type: Number, name: 'tempRoof', required: false, default: 35 })
    @ApiQuery({ type: String, name: 'purposes', required: true, default: [Purpose.GoOut, Purpose.Work] })
    @ApiQuery({ type: String, name: 'label', required: false, default: 'Nike' })
    @ApiQuery({ name: 'size', required: false, default: Size.XL })
    async getSuggestion(
        @GetUser() user: JwtPayLoad,
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
            ...(kind && {kind: kind}),
            ...(tempFloor && {tempFloor: Number(tempFloor)}),
            ...(tempRoof && {tempRoof: Number(tempRoof)}),
            purposes: ps,
            ...(label && { label: label }),
            ...(size && { size: size })
        } as SuggestionDto

        return await this.assistantService.getSuggestion(dto, user.sub);
    }
}