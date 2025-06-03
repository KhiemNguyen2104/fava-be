import { ApiProperty } from "@nestjs/swagger";
import { ClothesKind, Purpose, Size } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsSemVer, IsString } from "class-validator";

export class SuggestionDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ required: true, type: String, default: [Purpose.Work, Purpose.GoOut] })
    purposes: Purpose[]

    @IsOptional()
    @IsEnum(ClothesKind)
    @ApiProperty({ required: true, default: ClothesKind.TShirt })
    kind?: ClothesKind

    @IsOptional()
    @IsEnum(Size)
    @ApiProperty({ required: false, default: Size.XL })
    size?: Size

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, default: "Nike", type: String })
    label?: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 22, type: Number })
    tempFloor?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 35, type: Number })
    tempRoof?: number
}