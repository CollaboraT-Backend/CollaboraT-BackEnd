import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdatePasswordDto } from '../common/dtos/update-password.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { CompanyResponseFormatDto } from './dto/company-response-format.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private readonly configservice: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseFormatDto> {
    try {
      createCompanyDto.password = await hashPassword(
        createCompanyDto.password,
        this.configservice,
      );
      createCompanyDto.email = createCompanyDto.email.toLocaleLowerCase();
      const newCompany = await this.prisma.company.create({
        data: createCompanyDto,
      });
      return plainToInstance(CompanyResponseFormatDto, newCompany);
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.company.findUnique({ where: { id } });
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
}
