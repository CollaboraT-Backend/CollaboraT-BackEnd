import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { createCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(comment: createCommentDto) {
    const commentResult = await this.prisma.taskComment.create({
      data: {
        comment: comment.comment,
        taskId: comment.taskId,
        madeById: comment.madeById,
      },
    });
    return commentResult;
  }

  async seeCommentsByTask(Taskid: string) {
    const response = await this.prisma.taskComment.findMany({
        take:5,
        where:{
            taskId:Taskid
        },
        orderBy: {createdAt:'desc'}
    })
  }
}
