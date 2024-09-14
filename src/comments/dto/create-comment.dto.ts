import { IsString } from "class-validator";

export class createCommentDto {
    @IsString()
    comment:string;

    @IsString()
    taskId:string;

    @IsString()
    madeById:string;
    
}