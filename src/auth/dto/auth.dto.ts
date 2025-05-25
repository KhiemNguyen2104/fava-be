import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({type: String, required: true, default: 'nphucanhduong@gmail.com'})
    userEmail: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, required: true, default: '12345678'})
    password: string
}

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({type: String, required: true, default: 'nphucanhduong@gmail.com'})
    userEmail: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, required: true, default: 'Khiem Nguyen Phuc Gia'})
    userName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, required: true, default: '12345678'})
    password: string
}