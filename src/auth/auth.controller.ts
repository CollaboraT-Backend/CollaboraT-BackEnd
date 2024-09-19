import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompanyResponseFormatDto } from 'src/companies/dto/company-response-format.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Collaborator, Company } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasPasswordDto } from 'src/common/dtos/has-password.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register/companies')
  async registerCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseFormatDto> {
    return await this.authService.registerCompany(createCompanyDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('register/companies/:companyId/collaborators')
  async registerCollaborators(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() body: HasPasswordDto,
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ) {
    const passwordToExcel: string = body.password;
    return await this.authService.registerCollaborators(
      file,
      passwordToExcel,
      companyId,
    );
  }

  @Public()
  @UseGuards(AuthGuard('localStrategy'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as Company | Collaborator;
    const jwt = this.authService.generateJWT(user);
    return jwt;
  }
}
