import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private readonly configservice: ConfigService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      createCompanyDto.password = await hashPassword(
        createCompanyDto.password,
        this.configservice,
      );
      return this.prisma.company.create({ data: createCompanyDto });
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

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const companyUpdated = await this.prisma.company.update({
        where: { id, deleteAt: null },
        data: updateCompanyDto,
      });
      if (!companyUpdated) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Record of company not found',
        });
      }
      return {
        success: true,
        message: 'Company updated successfully',
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
        where: { id, deleteAt: null },
        data: { deleteAt: new Date() },
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
