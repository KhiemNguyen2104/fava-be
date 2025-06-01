import { ApiProperty } from "@nestjs/swagger";
import { ClothesKind, Size } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddClothesDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true, default: "T1 Jacket" })
    name: string

    @IsEnum(ClothesKind)
    @IsNotEmpty()
    @ApiProperty({ required: true, default: ClothesKind.TShirt })
    kind: ClothesKind

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 22, type: Number })
    tempFloor?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 35, type: Number })
    tempRoof?: number

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, default: "Nike", type: String })
    label?: string

    @IsEnum(Size)
    @IsOptional()
    @ApiProperty({ required: false, default: Size.XL })
    size?: Size
}

export class DeleteClothesDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true, default: "T1 Jacket" })
    name: string

    @IsEnum(ClothesKind)
    @IsNotEmpty()
    @ApiProperty({ required: true, default: ClothesKind.TShirt })
    kind: ClothesKind

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 22, type: Number })
    tempFloor: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 35, type: Number })
    tempRoof: number

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, default: "Nike", type: String })
    label?: string

    @IsEnum(Size)
    @IsOptional()
    @ApiProperty({ required: false, default: Size.XL })
    size?: Size
}

export class GetClothesDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true, default: "T1 Jacket" })
    name: string

    @IsEnum(ClothesKind)
    @IsNotEmpty()
    @ApiProperty({ required: true, default: ClothesKind.TShirt })
    kind: ClothesKind

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 22, type: Number })
    tempFloor: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 35, type: Number })
    tempRoof: number

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, default: "Nike", type: String })
    label?: string

    @IsEnum(Size)
    @IsOptional()
    @ApiProperty({ required: false, default: Size.XL })
    size?: Size
}