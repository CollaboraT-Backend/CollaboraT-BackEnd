import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CollaboratorRole } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { isNotEmpty } from 'class-validator';
import { ErrorManager } from 'src/common/filters/error-manager.filter';
import { generateHashedRandomPassword } from 'src/common/helpers/generate-random-password.helper';
import { FilesService } from 'src/files/files.service';
import { OccupationsService } from 'src/occupations/occupations.service';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import validator from 'validator';
import { CollaboratorFormatToExcel } from './dto/collaborator-format-to-excel.dto';
import { UpdatePasswordDto } from 'src/common/dtos/update-password.dto';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CollaboratorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly occupationsService: OccupationsService,
    @Inject(forwardRef(() => AuthService))
    private readonly authServices: AuthService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    file: Express.Multer.File,
    passwordToExcel: string,
    companyId: string,
  ) {
    try {
      // verify if file exist or no it is empty
      this.filesService.verifyFile(file);

      // parse csv file
      const parsedData: ICollaboratorRow[] = await this.filesService.parserCsv(
        file.buffer,
      );

      // Get rows with data
      const rowsWithData: ICollaboratorRow[] = parsedData.filter(isNotEmpty);

      // verify header keys
      this.filesService.validateKeys(rowsWithData[0], [
        'name',
        'email',
        'role',
        'occupation',
      ]);

      // verify all data rows has the necessary data
      this.filesService.verifyNecessaryDataInRows(rowsWithData);

      // Register users
      const registeredUsers = await this.createUsers(rowsWithData, companyId);
      console.log(registeredUsers);

      // Generate excel
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  private async createUsers(
    users: any[],
    companyId: string,
  ): Promise<CollaboratorFormatToExcel[]> {
    try {
      const usersToExcel = [];
      await this.prisma.$transaction(async (prismaTx) => {
        for (const user of users) {
          const { name, email, role, occupation } = user;
          //validate email
          if (!validator.isEmail(email.toLowerCase().trim())) {
            throw new ErrorManager({
              type: 'CONFLICT',
              message: 'The data for registration user is in invalid format',
            });
          }

          //validate if a collaborator with the provided email alredy exists
          const existsCollaborator = await prismaTx.collaborator.findUnique({
            where: { email: email.toLowerCase().trim() },
          });

          if (existsCollaborator) {
            throw new ErrorManager({
              type: 'CONFLICT',
              message: `A collaborator with the email '${email}' already exists.`,
            });
          }

          //validate occupation
          const occupationId =
            await this.occupationsService.getOccupationIdByName(
              occupation.toLowerCase().trim(),
            );

          if (!occupationId) {
            throw new ErrorManager({
              type: 'NOT_FOUND',
              message: `The occupation '${occupation}' does not exist.`,
            });
          }

          // Determine user role
          let roleToUser: CollaboratorRole = CollaboratorRole.collaborator;
          if (role === 'leader') {
            roleToUser = CollaboratorRole.leader;
          }

          // Generate password
          const {
            randomPassword,
            hashedRandomPassword,
          }: { randomPassword: string; hashedRandomPassword: string } =
            await generateHashedRandomPassword(this.configService);

          // Create collaborator
          const newCollaborator = await prismaTx.collaborator.create({
            data: {
              name: name.toLowerCase().trim(),
              email: email.toLowerCase().trim(),
              role: roleToUser,
              occupationId,
              password: hashedRandomPassword,
              companyId,
            },
          });

          // Set the password without hash for export
          newCollaborator.password = randomPassword;

          // Format user for excel export
          const newCollaboratorToExcel = plainToClass(
            CollaboratorFormatToExcel,
            newCollaborator,
          );

          // Add collaborator to excel list
          usersToExcel.push(newCollaboratorToExcel);
        }
      });
      return usersToExcel;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('An unexpected error ocurred');
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.collaborator.findUnique({
      where: { email: email.toLocaleLowerCase().trim(), deletedAt: null },
    });
  }

  async updateCollaboratorPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
    userType: 'collaborator' | 'company',
  ) {
    return this.authServices.updatePassword(id, updatePasswordDto, userType);
  }
}
