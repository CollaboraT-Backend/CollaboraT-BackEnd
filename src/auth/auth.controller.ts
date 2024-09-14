import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompanyResponseFormatDto } from 'src/companies/dto/company-response-format.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/company')
  async register(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseFormatDto> {
    return await this.authService.registerCompany(createCompanyDto);
  }

  @Post('login')
  login() {}

  //   @Post('login')
  //   async login(@Body() { username, password }: LoginAuthDto) {
  //     const userValidate = await this.authService.validateUser(
  //       username,
  //       password,
  //     );
  //     const jwt = await this.authService.generateJwt(userValidate);
  //     return jwt;
  //   }
}
