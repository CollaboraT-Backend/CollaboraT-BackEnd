import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdatePasswordDto } from '../common/dtos/update-password.dto';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { ErrorManager } from '../common/filters/error-manager.filter';
import { hashPassword } from '../common/helpers/hash-password.helper';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { UserResponseFormatDto } from 'src/common/dtos/user-response-format.dto';
import { AuthService } from '../auth/auth.service';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { PayloadToken } from 'src/common/interfaces/auth/payload-token.interface';
import { CollaboratorRole } from '@prisma/client';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private readonly configservice: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<UserResponseFormatDto> {
    try {
      createCompanyDto.password = await hashPassword(
        createCompanyDto.password,
        this.configservice,
      );
      createCompanyDto.email = createCompanyDto.email.toLocaleLowerCase();
      const newCompany = await this.prisma.company.create({
        data: createCompanyDto,
      });
      return plainToInstance(UserResponseFormatDto, newCompany);
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.company.findUnique({
      where: { email: email.toLocaleLowerCase().trim(), deletedAt: null },
    });
  }

  async updateCompanyPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
    userType: 'collaborator' | 'company',
  ) {
    return await this.authService.updatePassword(
      id,
      updatePasswordDto,
      userType,
    );
  }

  async updateCollaboratorRole(
    id: string,
    companyId: string,
    newRole: CollaboratorRole,
  ) {
    return await this.collaboratorsService.updateCollaboratorRole(
      id,
      companyId,
      newRole,
    );
  }

  async remove(id: string) {
    try {
      const companyDeleted = await this.prisma.company.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      if (!companyDeleted) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Record of company not found',
        });
      }
      return {
        success: true,
        message: 'Company deleted successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async findAllCollaborator(
    user: PayloadToken,
  ): Promise<UserResponseFormatDto[]> {
    return await this.collaboratorsService.findAllCollaboratorsByCompany(
      user.sub,
    );
  }
  async deleteCollaborator(user: PayloadToken, collaboratorId: string) {
    return await this.collaboratorsService.delete(collaboratorId, user.sub);
  }

  async createProject(createProjectDto: CreateProjectDto) {
    return await this.projectsService.create(createProjectDto);
  }

  async findAllProjects(companyId: string) {
    return await this.projectsService.findAll(companyId);
  }

  async deleteProject(id: string, companyId: string) {
    return await this.projectsService.remove(id, companyId);
  }
}
