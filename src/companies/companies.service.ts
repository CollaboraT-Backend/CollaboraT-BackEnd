import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdatePasswordCompanyDto } from './dto/update-password-company.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { CompanyResponseFormatDto } from './dto/company-response-format.dto';
import { validatePassword } from 'src/common/helpers/validate-password.helper';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private readonly configservice: ConfigService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyResponseFormatDto> {
    try {
      createCompanyDto.password = await hashPassword(
        createCompanyDto.password,
        this.configservice,
      );
      const newCompany = await this.prisma.company.create({ data: createCompanyDto });
      return plainToInstance(CompanyResponseFormatDto,newCompany);
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.company.findMany();
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

  async updatePassword(id: string, updateCompanyDto: UpdatePasswordCompanyDto) {
    try {
      const companyToUpdate = await this.prisma.company.findUnique({
        where: { id, deletedAt: null },
      });
      if (!companyToUpdate) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Record of company not found',
        });
      }

      //Validate previous password
      await validatePassword(updateCompanyDto.oldPassword, companyToUpdate.password); 


      //Hash new password
      companyToUpdate.password = await hashPassword(updateCompanyDto.newPassword, this.configservice);

      await this.prisma.company.update({where: {id: companyToUpdate.id, deletedAt: null}, data: companyToUpdate})
      
      return {
        success: true,
        message: 'Updated successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
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
