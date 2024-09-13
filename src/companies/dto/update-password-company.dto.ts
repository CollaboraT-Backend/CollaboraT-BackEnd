import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, isNotEmpty } from "class-validator";


export class UpdatePasswordCompanyDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    oldPassword:string
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPassword:string
}
