import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompanyResponseFormatDto } from 'src/companies/dto/company-response-format.dto';
import { JwtService } from '@nestjs/jwt';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { validatePassword } from 'src/common/helpers/validate-password.helper';
import { Company } from '@prisma/client';
import { PayloadToken } from 'src/common/interfaces/auth/payload-token.interface';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService,
  ) {}

  async registerCompany(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseFormatDto> {
    return this.companiesService.create(createCompanyDto);
  }

  async validateUser(email: string, password: string){
    try {
      //Search for company by email
      const company = await this.companiesService.findByEmail(email);
      
      if(!company){
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Record of company not found',
        })
      }

      //validate password
      await validatePassword(password, company.password);

      //return validated company
      return company
    } catch (error) {
      if(error instanceof Error){
        throw ErrorManager.createSignatureError(error.message)
      }
      throw ErrorManager.createSignatureError('An unexpected error occurred')
    }
  }

  generateJWT(user: Company) {
    const payload: PayloadToken = {
      sub: user.id,
      role: user.role
    }
    const userToResponse = plainToClass(CompanyResponseFormatDto, user);
    return {
      access_token: this.jwtService.sign(payload),
      user: userToResponse
    }
      
  }

}
