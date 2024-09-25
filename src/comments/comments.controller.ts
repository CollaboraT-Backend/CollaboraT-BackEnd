/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { createCommentDto } from './dto/create-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //Debe llegar id task e id user
  @Rbac(['company', 'leader', 'collaborator'], 'canCreate', 7)
  @UseGuards(PermissionsGuard)
  @Post()
  async makeComment(@Body() comment: createCommentDto) {
    return await this.commentsService.createComment(comment);
  }

  //debe llegar el Id de la tarea
  @Rbac(['company', 'leader', 'collaborator'], 'canGet', 7)
  @UseGuards(PermissionsGuard)
  @Get()
  async getComments(@Body() taskId: string) {
    return await this.commentsService.seeCommentsByTask(taskId);
  }
}
