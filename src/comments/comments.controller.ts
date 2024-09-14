/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { createCommentDto } from './dto/create-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
    
    @Post() 
    async makeComment(@Body() comment: createCommentDto) {
        return await this.commentsService.createComment(comment);
    }
    @Get()
    async getComments(@Body() taskId: string) {
        return await this.commentsService.seeCommentsByTask(taskId);
    }
}
