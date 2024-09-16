import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompanyResponseFormatDto } from 'src/companies/dto/company-response-format.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Company } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register/companies')
  async register(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseFormatDto> {
    return await this.authService.registerCompany(createCompanyDto);
  }
  @Public()
  @UseGuards(AuthGuard('localStrategy'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as Company;
    const jwt = this.authService.generateJWT(user);
    return jwt;
  }
}
