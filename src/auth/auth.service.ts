import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompanyResponseFormatDto } from 'src/companies/dto/company-response-format.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly configService: ConfigService,
  ) {}

  async registerCompany(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseFormatDto> {
    return this.companiesService.create(createCompanyDto);
  }
}
