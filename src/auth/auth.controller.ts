import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompanyResponseFormatDto } from 'src/companies/dto/company-response-format.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Collaborator, Company } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasPasswordDto } from 'src/common/dtos/has-password.dto';
import { CsvFilePipe } from 'src/common/pipes/csv-file.pipe';

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
    @UploadedFile('file', new CsvFilePipe()) file: Express.Multer.File,
    @Body() hasPasswordDto: HasPasswordDto,
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Res() res: Response,
  ) {
    const generatedExcel = await this.authService.registerCollaborators(
      file,
      hasPasswordDto,
      companyId,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=collaborators.xlsx`,
    );

    await generatedExcel.xlsx.write(res);

    res.end();
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
