import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true, default: "nphucanhduong@gmail.com", description: "User Email" })
    userEmail: string

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false, default: "Duong Nguyen Phuc Anh", description: "User Name" })
    userName?: string

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false, default: "Ha Noi", description: "The location that user used for suggestions" })
    currentLocation?: string
}