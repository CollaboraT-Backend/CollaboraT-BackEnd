import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CompanyResponseFormatDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    id:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nit:string

    @Exclude()
    password:string

    @Exclude()
    createdAt:Date

    @Exclude()
    updatedAt:Date

    @Exclude()
    deletedAt:Date
}