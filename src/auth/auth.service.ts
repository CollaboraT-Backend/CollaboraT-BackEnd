import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { UserResponseFormatDto } from 'src/common/dtos/user-response-format.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { validatePassword } from 'src/common/helpers/validate-password.helper';
import { Collaborator, Company } from '@prisma/client';
import { PayloadToken } from 'src/common/interfaces/auth/payload-token.interface';
import { plainToClass } from 'class-transformer';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePasswordDto } from 'src/common/dtos/update-password.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { hashPassword } from 'src/common/helpers/hash-password.helper';
import { ConfigService } from '@nestjs/config';
import { HasPasswordDto } from 'src/common/dtos/has-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
    @Inject(forwardRef(() => CollaboratorsService))
    private readonly collaboratorsService: CollaboratorsService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async registerCompany(
    createCompanyDto: CreateCompanyDto,
  ): Promise<UserResponseFormatDto> {
    return this.companiesService.create(createCompanyDto);
  }

  async registerCollaborators(
    file: Express.Multer.File,
    passwordToExcel: HasPasswordDto,
    companyId: string,
  ) {
    return this.collaboratorsService.create(file, passwordToExcel, companyId);
  }

  async validateUser({
    email,
    password,
  }: LoginAuthDto): Promise<Company | Collaborator> {
    try {
      //Search for user by email in collaborators
      let foundUser: Company | Collaborator | null =
        await this.collaboratorsService.findByEmail(email);
      // If not found in comllaborators, search in companies
      if (!foundUser) {
        foundUser = await this.companiesService.findByEmail(email);
        if (!foundUser) {
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'Invalid credentials',
          });
        }
      }

      //validate password
      await validatePassword(password, foundUser.password);

      //return validated user
      return foundUser;
    } catch (error) {
      // Handle known errors
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      // Handle unexpected errors
      throw ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
    userType: 'collaborator' | 'company',
  ) {
    try {
      let userToUpdate: Company | Collaborator;
      if (userType === 'company') {
        userToUpdate = await this.prisma.company.findUnique({
          where: { id, deletedAt: null },
        });
      } else {
        userToUpdate = await this.prisma.collaborator.findUnique({
          where: { id, deletedAt: null },
        });
      }

      if (!userToUpdate) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Record of company not found',
        });
      }

      //Validate previous password
      await validatePassword(
        updatePasswordDto.oldPassword,
        userToUpdate.password,
      );

      //Hash new password
      userToUpdate.password = await hashPassword(
        updatePasswordDto.newPassword,
        this.configService,
      );

      if (userType === 'company') {
        await this.prisma.company.update({
          where: { id: userToUpdate.id, deletedAt: null },
          data: { password: userToUpdate.password },
        });
      } else {
        await this.prisma.collaborator.update({
          where: { id: userToUpdate.id, deletedAt: null },
          data: { password: userToUpdate.password },
        });
      }

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

  generateJWT(user: Company | Collaborator) {
    const payload: PayloadToken = {
      sub: user.id,
      role: user.role,
    };
    const userToResponse = plainToClass(UserResponseFormatDto, user);
    return {
      access_token: this.jwtService.sign(payload),
      user: userToResponse,
    };
  }
}
